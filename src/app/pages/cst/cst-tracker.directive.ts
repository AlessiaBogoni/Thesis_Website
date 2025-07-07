// src/app/cst/cst-tracker.directive.ts (Example)

import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { CstService } from './cst.service';
import {
  CST_EVENT_DEBOUNCE_TIME,
  CST_HEATMAP_SUB_ELEMENT_SELECTORS,
  CST_MOUSE_ENTER_THROTTLE_TIME,
} from './cst.config';
import { fromEvent, Subject, merge } from 'rxjs';
import { debounceTime, throttleTime, takeUntil, filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appCstTracker]',
})
export class CstTrackerDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input('appCstTracker') containerId!: string;

  private destroy$ = new Subject<void>();
  private scrollDebounceTime = CST_EVENT_DEBOUNCE_TIME; // Or get from service config
  private mouseEnterThrottleTime = CST_MOUSE_ENTER_THROTTLE_TIME;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cstService: CstService
  ) {}

  ngOnInit(): void {
    if (!this.containerId) {
      console.error(
        'CSTTrackerDirective: containerId input is required.'
      );
      return;
    }

    this.cstService.initContainer(this.containerId, this.el.nativeElement);

    // Observe container visibility for dwell time
    const containerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.cstService.updateContainerVisibility(
            this.containerId,
            entry.isIntersecting && entry.intersectionRatio > 0
          );
        });
      },
      { threshold: 0 } // Observe when any part enters/leaves the viewport
    );
    containerObserver.observe(this.el.nativeElement);
    this.destroy$.pipe(take(1)).subscribe(() => containerObserver.disconnect()); // Disconnect on destroy

    // Setup scroll event listener
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(debounceTime(this.scrollDebounceTime), takeUntil(this.destroy$))
      .subscribe(() => {
        const element = this.el.nativeElement;
        this.cstService.addScrollEvent(
          this.containerId,
          element.scrollTop,
          element.clientHeight,
          element.scrollHeight
        );
      });

    // Setup typing activity listener (keyup)
    fromEvent(this.el.nativeElement, 'keyup')
      .pipe(
        filter((event: Event) => {
          const keyboardEvent = event as KeyboardEvent;
          // Consider only relevant keys for typing activity (e.g., alphanumeric, space, backspace)
          return (
            keyboardEvent.key.length === 1 ||
            keyboardEvent.key === 'Backspace' ||
            keyboardEvent.key === 'Delete' ||
            keyboardEvent.key === ' '
          );
        }),
        throttleTime(100), // Prevent too many rapid events
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cstService.addTypingActivity(this.containerId);
      });

    // Setup text selection listener
    fromEvent(this.el.nativeElement, 'mouseup')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        const selection = window.getSelection();
        if (
          selection &&
          selection.rangeCount > 0 &&
          this.el.nativeElement.contains(selection.anchorNode)
        ) {
          this.cstService.recordTextSelection(this.containerId, selection);
        }
      });
  }

  ngAfterViewInit(): void {
    // After the view is initialized, apply data-cst-sub-id to sub-elements
    // and set up mouseenter listeners.
    this.applySubElementIdsAndListeners();
  }

  private applySubElementIdsAndListeners(): void {
    const subElements = this.el.nativeElement.querySelectorAll(
      CST_HEATMAP_SUB_ELEMENT_SELECTORS.join(',')
    );

    subElements.forEach((el: HTMLElement, index: number) => {
      // Generate a unique ID if it doesn't already have one
      let subId = el.dataset['cstSubId'];
      if (!subId) {
        subId = `${this.containerId}-sub-${index}`;
        this.renderer.setAttribute(el, 'data-cst-sub-id', subId);
      }

      // Record mouse enter events
      fromEvent(el, 'mouseenter')
        .pipe(
          throttleTime(this.mouseEnterThrottleTime),
          takeUntil(this.destroy$) // Ensure cleanup
        )
        .subscribe(() => {
          this.cstService.recordSubElementMouseEnter(this.containerId, subId!);
        });
    });
  }

  ngOnDestroy(): void {
    this.cstService.destroyContainer(this.containerId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
