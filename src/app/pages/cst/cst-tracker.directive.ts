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

 // src/app/cst/cst-tracker.directive.ts

ngOnInit(): void {
    
    // Rimuovi la variabile inutilizzata
    // const element = this.el.nativeElement; 
    
    // Aggiunto log di debug
    // console.log(`[CST INIT] Directive initialized for ID: ${this.containerId}.`); 

    if (!this.containerId) {
        console.error(
            'CSTTrackerDirective: containerId input is required.'
        );
        return;
    }

    // 1. Inizializza il container nel servizio
    this.cstService.initContainer(this.containerId, this.el.nativeElement);


    // 2. Setup dell'Intersection Observer per il DWELL TIME (corretto)
    const containerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                this.cstService.updateContainerVisibility(
                    this.containerId,
                    entry.isIntersecting && entry.intersectionRatio > 0
                );
            });
        },
        { threshold: 0 } 
    );
    containerObserver.observe(this.el.nativeElement);
    this.destroy$.pipe(take(1)).subscribe(() => containerObserver.disconnect());


    // 3. Setup del listener per la TYPING ACTIVITY (corretto)
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
            throttleTime(100), 
            takeUntil(this.destroy$)
        )
        .subscribe(() => {
            this.cstService.addTypingActivity(this.containerId);
        });

    // 4. Setup del listener per la TEXT SELECTION (corretto)
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
        
    // ❌ RIMOSSA: La logica di scroll e l'applicazione degli ID dei sub-elementi 
    //            vanno in ngAfterViewInit per assicurare che il DOM sia pronto.
}

  ngAfterViewInit(): void {
    // Identifica l'elemento scorrevole reale
    const SCROLL_CONTAINER_SELECTOR = '.app-content'; 
    
    const scrollElement = document.querySelector(SCROLL_CONTAINER_SELECTOR) as HTMLElement | null; 
    
    if (!scrollElement) {
        console.error(`[CST SCROLL ERROR] Elemento scroll '${SCROLL_CONTAINER_SELECTOR}' non trovato. Lo scroll non verrà tracciato.`);
        // Esegue comunque l'applicazione degli ID per gli altri tracciamenti
        this.applySubElementIdsAndListeners(); 
        return; 
    }
    
    // Funzione helper per ottenere scrollTop (semplificata per HTMLElement)
    const getScrollTop = (target: HTMLElement): number => {
        return target.scrollTop || 0;
    };
    
    // 1. ASCOLTO DELLO SCROLL SULL'ELEMENTO REALE (.app-content)
    fromEvent(scrollElement, 'scroll')
        .pipe(debounceTime(this.scrollDebounceTime), takeUntil(this.destroy$))
        .subscribe(() => {
            
            const scrollY = getScrollTop(scrollElement);
            
            // console.log(`[CST SCROLL FINAL] Target: ${SCROLL_CONTAINER_SELECTOR}, ScrollY: ${scrollY}`);

            this.cstService.addScrollEvent(
                this.containerId,
                scrollY, 
                scrollElement.clientHeight, 
                scrollElement.scrollHeight  
            );
        });
        
    // 2. Applicazione degli ID e listener (già corretta, ma spostata qui)
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
