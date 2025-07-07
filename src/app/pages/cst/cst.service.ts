// src/app/cst/cst.service.ts

import { Injectable, NgZone, OnDestroy, /* REMOVE Renderer2 if it was here */ } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, timer, merge } from 'rxjs';
import { filter, map, debounceTime, throttleTime, distinctUntilChanged } from 'rxjs/operators'; // Added distinctUntilChanged
import {
  CstConfig,
  CstWeights,
  CstContainerData,
  CstSubElementData,
  CstCalculatedScores,
  CST_HEATMAP_INTERSECTION_THRESHOLD,
  CST_EVENT_DEBOUNCE_TIME,
  CST_HEATMAP_SUB_ELEMENT_SELECTORS,
  CST_MOUSE_ENTER_THROTTLE_TIME
} from './cst.config';

// Define CST Configuration and Weights (kept here for default values)
const DEFAULT_CST_CONFIG: CstConfig = {
  weights: {
    scrollDepth: 0.2,
    scrollEfficiency: 0.15,
    dwellTime: 0.25,
    activeWindow: 0.1,
    copyPaste: 0.05,
    textSelection: 0.05,
    typingActivity: 0.05,
    attentionCheck: 0.1,
    anomalyDetection: 0.05
  },
  scrollDebounceMs: 100,
  dwellTimeThrottleMs: 500, // Not directly used with IntersectionObserver for overall container
  activeWindowCheckIntervalMs: 2000,
  minTypingSpeedCPM: 60
};

// Internal structure to hold container data and its associated observers for cleanup
interface CstContainerTracker {
  data: CstContainerData;
  subElementObservers: Map<string, IntersectionObserver>; // Observers for each sub-element
  resizeObserver: ResizeObserver | null; // For overall container resize
}

@Injectable({
  providedIn: 'root'
})
export class CstService implements OnDestroy {
  private config: CstConfig = DEFAULT_CST_CONFIG;
  private cstContainers = new Map<string, CstContainerTracker>(); // Renamed for clarity

  // Observable for overall CST score (single value)
  private _overallCstScore = new BehaviorSubject<number>(0);
  public readonly overallCstScore$: Observable<number> = this._overallCstScore.asObservable();

  // NEW: Observable to expose all detailed container data (including sub-elements) for heatmaps
  private _allContainerDetailedData = new BehaviorSubject<Map<string, CstContainerData>>(new Map());
  public readonly allContainerDetailedData$: Observable<Map<string, CstContainerData>> = this._allContainerDetailedData.asObservable();

  // NEW: Observable to expose calculated scores for each container
  private _allContainerCalculatedScores = new BehaviorSubject<Map<string, CstCalculatedScores>>(new Map());
  // tslint:disable-next-line:max-line-length
  public readonly allContainerCalculatedScores$: Observable<Map<string, CstCalculatedScores>> = this._allContainerCalculatedScores.asObservable();

  private activeWindowScore = 0; // Binary: 1 if tab is visible, 0 otherwise
  private globalActivityMonitorSubscription: any;
  private scoreCalculationLoopSubscription: any;

  constructor(private ngZone: NgZone) {
    this.setupGlobalListeners();
    this.startScoreCalculationLoop();
  }

  // --- Global Listeners (Window Focus, Copy Events) ---
  private setupGlobalListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      // Listen for tab visibility changes (focus/blur)
      this.globalActivityMonitorSubscription = merge(
        fromEvent(document, 'visibilitychange').pipe(map(() => document.visibilityState === 'visible')),
        timer(0, this.config.activeWindowCheckIntervalMs).pipe(
          filter(() => document.visibilityState === 'visible'),
          map(() => true)
        )
      ).pipe(
        debounceTime(50), // Debounce rapid focus/blur
        distinctUntilChanged() // Only emit when visibility state actually changes
      ).subscribe((isFocused) => {
        this.activeWindowScore = isFocused ? 1 : 0;
        // Update dwell times for all currently visible sub-elements across all containers
        this.updateAllDwellTimes(performance.now());
        this.calculateAndEmitScores(); // Recalculate overall CST
      });

      // Listen for global copy event to mark relevant sub-elements and containers
      fromEvent(document, 'copy')
        .pipe(throttleTime(100)) // Throttle to prevent multiple rapid events
        .subscribe(() => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            this.cstContainers.forEach(containerTracker => {
              let containerCopied = false;
              containerTracker.data.subElements.forEach(subElement => {
                // Check if the selected range intersects with any sub-element
                if (range.intersectsNode(subElement.nativeElement)) {
                  subElement.hasCopiedText = true;
                  containerCopied = true;
                }
              });
              if (containerCopied) {
                containerTracker.data.hasCopied = true; // Mark overall container
              }
            });
            this.emitDetailedData(); // Emit updated granular data for heatmaps
            this.calculateAndEmitScores(); // Recalculate overall CST
          }
        });
    });
  }

  // --- Score Calculation Loop ---
  private startScoreCalculationLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scoreCalculationLoopSubscription = timer(0, 1000) // Update every 1 second
        .subscribe(() => {
          this.updateAllDwellTimes(performance.now()); // Update dwell times before calculating scores
          this.calculateAndEmitScores();
        });
    });
  }

  // Updates dwell time for all currently visible sub-elements and overall containers
  private updateAllDwellTimes(now: number): void {
    this.cstContainers.forEach(containerTracker => {
      // Update overall container dwell time based on its visibility
      if (containerTracker.data.isVisible && containerTracker.data.lastVisibilityChange !== null) {
        containerTracker.data.totalDwellTime += (now - containerTracker.data.lastVisibilityChange);
        containerTracker.data.lastVisibilityChange = now;
      }

      // Update granular sub-element dwell time
      containerTracker.data.subElements.forEach(subElement => {
        if (subElement.isVisible && subElement.lastVisibilityChangeTime !== null) {
          subElement.cumulativeVisibleTime += (now - subElement.lastVisibilityChangeTime);
          subElement.lastVisibilityChangeTime = now;
        }
      });
    });
  }

  // --- Public API for CSTTrackerDirective ---

  initContainer(containerId: string, element: HTMLElement): void {
    if (this.cstContainers.has(containerId)) {
      console.warn(`CSTService: Container ID '${containerId}' already initialized. Skipping.`);
      return;
    }

    const newContainerData: CstContainerData = {
      id: containerId, // Ensure ID is part of the data
      element: element,
      totalDwellTime: 0,
      lastVisibilityChange: performance.now(),
      isVisible: false, // Will be updated by IntersectionObserver for the container
      scrollEvents: [],
      maxScrollDepth: 0,
      scrollDirectionChanges: 0,
      typingActivityCount: 0,
      hasCopied: false,
      hasSelected: false,
      attentionCheckScore: 0, // Default
      anomalyDetected: false, // Default
      subElements: new Map<string, CstSubElementData>(), // Initialize sub-element map
    };

    const tracker: CstContainerTracker = {
      data: newContainerData,
      subElementObservers: new Map(),
      resizeObserver: null,
    };
    this.cstContainers.set(containerId, tracker);

    // Scan and observe sub-elements within this container
    this.scanAndObserveSubElements(containerId, element);
    this.observeContainerResize(containerId, element); // Observe main container resize

    this.emitDetailedData(); // Emit initial data
  }

  destroyContainer(containerId: string): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      // Disconnect all sub-element observers
      tracker.subElementObservers.forEach(obs => obs.disconnect());
      // Disconnect main container resize observer
      if (tracker.resizeObserver) {
        tracker.resizeObserver.disconnect();
      }
      this.cstContainers.delete(containerId);
      this.emitDetailedData(); // Emit updated data after removal
      this.calculateAndEmitScores(); // Recalculate overall CST
    }
  }

  // Called by IntersectionObserver for the main container
  updateContainerVisibility(containerId: string, isIntersecting: boolean): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      const now = performance.now();
      if (isIntersecting && !tracker.data.isVisible) {
        tracker.data.isVisible = true;
        tracker.data.lastVisibilityChange = now;
      } else if (!isIntersecting && tracker.data.isVisible) {
        // Element became invisible, update its dwell time
        tracker.data.isVisible = false;
        if (tracker.data.lastVisibilityChange !== null) {
          tracker.data.totalDwellTime += (now - tracker.data.lastVisibilityChange);
        }
        tracker.data.lastVisibilityChange = null; // Reset
      }
      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  // Called by scroll event listener on the container
  addScrollEvent(containerId: string, scrollTop: number, elementHeight: number, scrollHeight: number): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      // Update max scroll depth within the container
      const scrollableHeight = scrollHeight - elementHeight;
      if (scrollableHeight > 0) {
        tracker.data.maxScrollDepth = Math.max(tracker.data.maxScrollDepth, scrollTop / scrollableHeight);
      } else {
        tracker.data.maxScrollDepth = 1; // Content fits without scrolling
      }

      // Detect scroll reversals (simplified logic)
      if (tracker.data.scrollEvents.length > 0) {
        const lastScrollTop = tracker.data.scrollEvents[tracker.data.scrollEvents.length - 1].scrollTop;

        // More robust scroll direction change detection
        const lastDirection = tracker.data.scrollEvents.length > 1
            ? Math.sign(lastScrollTop - tracker.data.scrollEvents[tracker.data.scrollEvents.length - 2].scrollTop)
            : 0;
        const currentDirection = Math.sign(scrollTop - lastScrollTop);

        if (currentDirection !== 0 && lastDirection !== 0 && currentDirection !== lastDirection) {
            tracker.data.scrollDirectionChanges++;
        }
      }
      tracker.data.scrollEvents.push({ scrollTop, timestamp: performance.now() });

      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  // Called by keyup event listener on the container
  addTypingActivity(containerId: string): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      tracker.data.typingActivityCount++;
      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  // Called by text selection event listener on the container
  recordTextSelection(containerId: string, selection: Selection | null): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      tracker.data.hasSelected = true; // Mark overall container

      // Mark individual sub-elements that contain selected text
      tracker.data.subElements.forEach(subElement => {
        if (range.intersectsNode(subElement.nativeElement)) {
          subElement.hasSelectedText = true;
        }
      });
      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  // --- NEW: Granular Sub-element Tracking for Heatmaps ---

  private scanAndObserveSubElements(containerId: string, containerElement: HTMLElement) {
    const tracker = this.cstContainers.get(containerId);
    if (!tracker) { return; }

    // Use querySelectorAll to find all elements matching the defined selectors
    const subElements = containerElement.querySelectorAll(CST_HEATMAP_SUB_ELEMENT_SELECTORS.join(','));

    subElements.forEach((el: HTMLElement, index) => {
      // **IMPORTANT:** The subId should now be set by the directive/component before this method is called.
      // We will read it from the element's dataset.
      const subId = el.dataset['cstSubId'];
      if (!subId) {
        // If no subId is found, log a warning or throw an error.
        // This indicates a missing data-cst-sub-id attribute on a sub-element.
        console.warn(`CstService: Sub-element found without 'data-cst-sub-id' attribute. It will not be tracked:`, el);
        return; // Skip tracking this element if it's not properly marked
      }

      if (!tracker.data.subElements.has(subId)) {
        const subData: CstSubElementData = {
          id: subId,
          nativeElement: el,
          cumulativeVisibleTime: 0,
          lastVisibilityChangeTime: null,
          isVisible: false,
          hasSelectedText: false,
          hasCopiedText: false,
          mouseEnterCount: 0,
        };
        tracker.data.subElements.set(subId, subData);

        // Create IntersectionObserver for each sub-element
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const targetSubId = (entry.target as HTMLElement).dataset['cstSubId'];
              if (targetSubId) {
                const subElement = tracker.data.subElements.get(targetSubId);
                if (subElement) {
                  const now = performance.now();
                  if (entry.isIntersecting && entry.intersectionRatio >= CST_HEATMAP_INTERSECTION_THRESHOLD) {
                    if (!subElement.isVisible) {
                      subElement.isVisible = true;
                      subElement.lastVisibilityChangeTime = now;
                    }
                  } else {
                    if (subElement.isVisible && subElement.lastVisibilityChangeTime !== null) {
                      // Add remaining visible time before becoming invisible
                      subElement.cumulativeVisibleTime += (now - subElement.lastVisibilityChangeTime);
                      subElement.isVisible = false;
                      subElement.lastVisibilityChangeTime = null;
                    }
                  }
                }
              }
            });
            this.emitDetailedData(); // Emit data on sub-element visibility changes for heatmaps
          },
          { threshold: CST_HEATMAP_INTERSECTION_THRESHOLD }
        );
        observer.observe(el);
        tracker.subElementObservers.set(subId, observer);
      }
    });
  }

  // Observe the main container's size for scroll depth calculation adjustments
  private observeContainerResize(containerId: string, element: HTMLElement) {
    const tracker = this.cstContainers.get(containerId);
    if (!tracker) { return; }

    if (typeof ResizeObserver !== 'undefined') {
      tracker.resizeObserver = new ResizeObserver(entries => {
        // Re-evaluate scroll depth based on new container dimensions
        this.addScrollEvent( // Re-using addScrollEvent to update scroll depth
          containerId,
          element.scrollTop,
          element.clientHeight, // Use clientHeight for current visible height
          element.scrollHeight // Use scrollHeight for total scrollable height
        );
      });
      tracker.resizeObserver.observe(element);
    }
  }

  // NEW: Record mouse enter events on sub-elements for mouse heatmaps
  recordSubElementMouseEnter(containerId: string, subElementId: string): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      const subElement = tracker.data.subElements.get(subElementId);
      if (subElement) {
        subElement.mouseEnterCount++;
        this.emitDetailedData(); // Emit for heatmap updates
      }
    }
  }

  // --- Public API for external components (e.g., quiz component) ---

  setAttentionCheckScore(containerId: string, score: number): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      tracker.data.attentionCheckScore = Math.max(0, Math.min(1, score));
      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  setAnomalyDetected(containerId: string, detected: boolean): void {
    const tracker = this.cstContainers.get(containerId);
    if (tracker) {
      tracker.data.anomalyDetected = detected;
      this.emitDetailedData();
      this.calculateAndEmitScores();
    }
  }

  // --- Overall CST Computation (uses data from CstContainerData) ---

  private calculateAndEmitScores(): void {
    const currentScores = new Map<string, CstCalculatedScores>();
    let totalOverallWeightedScore = 0;
    let totalOverallWeight = 0;

    this.cstContainers.forEach((tracker) => {
      const data = tracker.data;

      // Normalize constants (can be moved to config)
      const K_DT_PER_100_WORDS = 10000; // 10 seconds per 100 words of content for full score
      const K_SR = 10; // 10 scroll reversals for max score
      const K_TA_CPM = 60; // 60 characters per minute for max score

      // Estimate word count for dwell time normalization (simplistic)
      const contentWordCount = data.element?.innerText?.split(/\s+/).filter(word => word.length > 0).length || 100;

      const scrollDepthScore = data.maxScrollDepth;
      const scrollEfficiencyScore = Math.min(1, data.scrollDirectionChanges / K_SR);
      const dwellTimeScore = Math.min(1, data.totalDwellTime / (contentWordCount / 100 * K_DT_PER_100_WORDS));
      const activeWindowScore = this.activeWindowScore; // Uses global active window score
      const copyPasteScore = data.hasCopied ? 1 : 0;
      const textSelectionScore = data.hasSelected ? 1 : 0;
      const typingActivityScore = data.typingActivityCount > 0
        // tslint:disable-next-line:max-line-length
        ? Math.min(1, data.typingActivityCount / (data.totalDwellTime > 0 ? data.totalDwellTime / 60000 * K_TA_CPM : K_TA_CPM)) // Characters per minute
        : 0;
      const attentionCheckScore = data.attentionCheckScore;
      const anomalyDetectionScore = data.anomalyDetected ? 1 : 0;

      // Weights from config
      const weights = this.config.weights;

      const containerWeightedScore =
        weights.scrollDepth * scrollDepthScore +
        weights.scrollEfficiency * scrollEfficiencyScore +
        weights.dwellTime * dwellTimeScore +
        weights.activeWindow * activeWindowScore + // Active window is applied per container here
        weights.copyPaste * copyPasteScore +
        weights.textSelection * textSelectionScore +
        weights.typingActivity * typingActivityScore +
        weights.attentionCheck * attentionCheckScore +
        weights.anomalyDetection * anomalyDetectionScore;

      const containerTotalWeight =
        weights.scrollDepth +
        weights.scrollEfficiency +
        weights.dwellTime +
        weights.activeWindow +
        weights.copyPaste +
        weights.textSelection +
        weights.typingActivity +
        weights.attentionCheck +
        weights.anomalyDetection;

      const overallCSTForContainer = containerTotalWeight > 0 ? containerWeightedScore / containerTotalWeight : 0;

      currentScores.set(data.id, {
        id: data.id,
        scrollDepthScore,
        scrollEfficiencyScore,
        dwellTimeScore,
        activeWindowScore,
        copyPasteScore,
        textSelectionScore,
        typingActivityScore,
        attentionCheckScore,
        anomalyDetectionScore,
        overallCST: parseFloat(overallCSTForContainer.toFixed(3)),
      });

      // Aggregate for the single overall CST score (if multiple containers)
      totalOverallWeightedScore += containerWeightedScore;
      totalOverallWeight += containerTotalWeight;
    });

    // Emit scores for individual containers
    this._allContainerCalculatedScores.next(currentScores);

    // Emit the single overall CST score for the entire application
    const finalOverallCST = totalOverallWeight > 0 ? totalOverallWeightedScore / totalOverallWeight : 0;
    this._overallCstScore.next(parseFloat(finalOverallCST.toFixed(3)));
  }

  // Emits a new value for the detailed container data observable
  private emitDetailedData(): void {
    // Deep clone the map and its contents to ensure immutability
    const clonedMap = new Map<string, CstContainerData>();
    this.cstContainers.forEach((tracker, key) => {
      const clonedSubElements = new Map<string, CstSubElementData>();
      tracker.data.subElements.forEach((subData, subKey) => {
        // Make sure to clone nativeElement reference if needed,
        // but for just observation, copying data is usually enough.
        clonedSubElements.set(subKey, { ...subData, nativeElement: subData.nativeElement });
      });
      clonedMap.set(key, { ...tracker.data, subElements: clonedSubElements });
    });
    this._allContainerDetailedData.next(clonedMap);
  }

  // Allows setting custom config (weights, debounce times etc.)
  setConfig(config: Partial<CstConfig>): void {
    this.config = { ...this.config, ...config };
    this.config.weights = { ...this.config.weights, ...(config.weights || {}) };
    this.calculateAndEmitScores(); // Recalculate with new weights
  }

  getConfig(): CstConfig {
    return this.config;
  }

  ngOnDestroy(): void {
    if (this.globalActivityMonitorSubscription) {
      this.globalActivityMonitorSubscription.unsubscribe();
    }
    if (this.scoreCalculationLoopSubscription) {
      this.scoreCalculationLoopSubscription.unsubscribe();
    }
    this.cstContainers.forEach((tracker) => {
      tracker.subElementObservers.forEach(obs => obs.disconnect());
      if (tracker.resizeObserver) {
        tracker.resizeObserver.disconnect();
      }
    });
  }
}
