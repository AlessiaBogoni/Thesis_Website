import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { ToastService } from '../toast/toast.service'; // Import the ToastService

interface HighlightSectionOutput {
  text: string;
  color: string;
  startIndex: number;
  endIndex: number;
}

@Component({
  selector: "app-text-highlight",
  templateUrl: "./text-highlight.component.html",
  styleUrls: ["./text-highlight.component.scss"],
})
export class TextHighlightComponent implements AfterViewInit {
  currentSelection: string | null = null;
  selection: Selection | null = null;
  active = true;
  highlightColor = "yellow";
  highlightSections: { text: string; color: string; element: HTMLElement; startIndex: number; endIndex: number }[] =
    [];
  @Input() textContent = "";
  @Output() highlightSectionsChange = new EventEmitter<
        any[]
  >();
  @Output() selectionApplied = new EventEmitter<HighlightSectionOutput>(); // New output for single selection

  private isSelectingWithTouch = false;
  private startNode: Node | null = null;
  private startOffset = 0;
  private initialTouchX = 0;
  private initialTouchY = 0;
  private lastTouchPosition: { x: number; y: number } | null = null;
  private touchMoveThreshold = 5;
  private selectionStartDelay = 150;
  private touchStartTime = 0;
  private maxWordsToSelect = 10; // Max words allowed for selection
  tutorial = true;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService // Inject ToastService
  ) {}

  isMobile(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  ngAfterViewInit(): void {
    const textContainer = this.el.nativeElement.querySelector(".text-container");
    if (textContainer) {
      if (this.isMobile()) {
        this.renderer.listen(textContainer, "touchstart", this.handleTouchStart.bind(this));
        this.renderer.listen(textContainer, "touchmove", this.handleTouchMove.bind(this));
        this.renderer.listen(textContainer, "touchend", this.handleTouchEnd.bind(this));
        this.renderer.listen(textContainer, "touchcancel", this.handleTouchCancel.bind(this));

        // Listen for native selection changes as a fallback/complement
        this.renderer.listen(document, "selectionchange", () => this.textSelect());
      } else {
        // Desktop handling (mouseup for standard selection)
        this.renderer.listen(textContainer, "mouseup", (event: MouseEvent) => {
          this.handleAutomaticHighlight();
        });
        this.renderer.listen(document, "selectionchange", () => this.textSelect());
      }
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isSelectingWithTouch = false;
      this.touchStartTime = Date.now();

      const touch = event.touches[0];
      this.initialTouchX = touch.clientX;
      this.initialTouchY = touch.clientY;
      this.lastTouchPosition = { x: touch.clientX, y: touch.clientY };

      const { node, offset } = this.getNodeAndOffsetAtPoint(touch.clientX, touch.clientY);

      if (node && this.el.nativeElement.querySelector(".text-container")?.contains(node)) {
        this.startNode = node;
        this.startOffset = offset;
        this.clearNativeSelection();
      } else {
        this.startNode = null;
        this.isSelectingWithTouch = false;
      }
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    if (this.startNode && event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.initialTouchX);
      const deltaY = Math.abs(touch.clientY - this.initialTouchY);

      if (deltaY > this.touchMoveThreshold * 2 && deltaY > deltaX) {
        this.isSelectingWithTouch = false;
        this.clearNativeSelection();
        return;
      }

      if (deltaX > this.touchMoveThreshold && Date.now() - this.touchStartTime > this.selectionStartDelay) {
        this.isSelectingWithTouch = true;

        const { node: endNode, offset: endOffset } = this.getNodeAndOffsetAtPoint(touch.clientX, touch.clientY);

        if (endNode && this.startNode && this.el.nativeElement.querySelector(".text-container")?.contains(endNode)) {
          const selection = window.getSelection();
          selection.removeAllRanges();
          const range = document.createRange();

          const startPos = this.startNode.compareDocumentPosition(endNode);
          if (startPos === Node.DOCUMENT_POSITION_FOLLOWING ||
              (startPos === Node.DOCUMENT_POSITION_CONTAINED_BY && this.startOffset <= endOffset)) {
            range.setStart(this.startNode, this.startOffset);
            range.setEnd(endNode, endOffset);
          } else if (startPos === Node.DOCUMENT_POSITION_PRECEDING ||
                     (startPos === Node.DOCUMENT_POSITION_CONTAINS && this.startOffset >= endOffset)) {
            range.setStart(endNode, endOffset);
            range.setEnd(this.startNode, this.startOffset);
          } else {
            if (this.startOffset <= endOffset) {
              range.setStart(this.startNode, this.startOffset);
              range.setEnd(endNode, endOffset);
            } else {
              range.setStart(endNode, endOffset);
              range.setEnd(this.startNode, this.startOffset);
            }
          }
          selection.addRange(range);
        }
        event.preventDefault();
      }
      this.lastTouchPosition = { x: touch.clientX, y: touch.clientY };
    }
  }

  private handleTouchEnd(): void {
    if (this.isSelectingWithTouch) {
      this.handleAutomaticHighlight();
    }
    this.isSelectingWithTouch = false;
    this.startNode = null;
    this.startOffset = 0;
    this.lastTouchPosition = null;
    this.initialTouchX = 0;
    this.initialTouchY = 0;
    this.touchStartTime = 0;
  }

  private handleTouchCancel(): void {
    this.isSelectingWithTouch = false;
    this.startNode = null;
    this.startOffset = 0;
    this.lastTouchPosition = null;
    this.initialTouchX = 0;
    this.initialTouchY = 0;
    this.touchStartTime = 0;
    this.clearNativeSelection();
  }

  private getNodeAndOffsetAtPoint(x: number, y: number): { node: Node | null, offset: number } {
    const targetElement = document.elementFromPoint(x, y);

    if (!targetElement || !this.el.nativeElement.querySelector(".text-container")?.contains(targetElement)) {
      return { node: null, offset: 0 };
    }

    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      if (range) {
        return { node: range.startContainer, offset: range.startOffset };
      }
    } else if ((document as any).msCaretRangeFromPoint) {
        const range = (document as any).msCaretRangeFromPoint(x, y);
        if (range) {
            return { node: range.startContainer, offset: range.startOffset };
        }
    }

    let textNode: Node | null = null;
    let offset = 0;

    if (targetElement.nodeType === Node.TEXT_NODE) {
      textNode = targetElement;
    } else {
      const walker = document.createTreeWalker(
        targetElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      textNode = walker.firstChild();
      if (!textNode && targetElement.textContent && targetElement.textContent.trim().length > 0) {
        textNode = targetElement.firstChild;
      }
    }

    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      try {
          const tempRange = document.createRange();
          tempRange.selectNodeContents(textNode);
          let bestOffset = 0;
          let minDistance = Infinity;

          if (textNode.textContent) {
              for (let i = 0; i < textNode.textContent.length; i++) {
                  tempRange.setStart(textNode, i);
                  tempRange.setEnd(textNode, i + 1);
                  const charRect = tempRange.getBoundingClientRect();

                  const charX = charRect.left + charRect.width / 2;
                  const charY = charRect.top + charRect.height / 2;
                  const distance = Math.sqrt(Math.pow(x - charX, 2) + Math.pow(y - charY, 2));

                  if (distance < minDistance) {
                      minDistance = distance;
                      bestOffset = i;
                  }
              }
          }
          offset = bestOffset;
      } catch (e) {
          console.warn("Error calculating precise offset (fallback):", e);
          offset = 0;
      }
    } else {
        textNode = targetElement;
        offset = 0;
    }

    return { node: textNode, offset: offset };
  }

  private clearNativeSelection(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  textSelect(): void {
    this.selection = document.getSelection();
    const range = this.selection?.rangeCount
      ? this.selection.getRangeAt(0)
      : null;
    const text = this.selection?.toString();

    if (range && text && text.length > 0) {
      const startElement =
        range.startContainer.nodeType === 3
          ? range.startContainer.parentNode
          : range.startContainer;
      const startComponent = (startElement as HTMLElement)?.closest(
        ".text-container"
      );
      this.currentSelection = startComponent ? text : null;
    } else {
      this.currentSelection = null;
    }
  }

  applyHighlighting(markElement: HTMLElement): void {
    this.renderer.addClass(markElement, "animated");
    setTimeout(() => {
      this.renderer.addClass(markElement, "animate");
    }, 250);
  }

  removeHighlight(index: number): void {
    const markElement = this.highlightSections[index].element;
    if (markElement) {
      this.renderer.removeClass(markElement, "in");
      this.renderer.removeClass(markElement, "animate");
      this.renderer.removeClass(markElement, "animated");

      const parent = markElement.parentNode as HTMLElement;
      while (markElement.firstChild) {
        parent.insertBefore(markElement.firstChild, markElement);
      }
      parent.removeChild(markElement);
    }

    this.highlightSections.splice(index, 1);
    this.highlightSectionsChange.emit(this.highlightSections.map(e => e.text));
    this.cdr.detectChanges();
  }

  changeColor(color: string): void {
    const navBar = this.el.nativeElement.querySelector("#navBar");
    if (navBar) {
      this.renderer.removeClass(navBar, "animate");
      setTimeout(() => {
        this.renderer.removeClass(navBar, this.highlightColor);
        this.renderer.addClass(navBar, color);
        this.highlightColor = color;
        setTimeout(() => {
          this.renderer.addClass(navBar, "animate");
        }, 250);
      }, 250);
    }
  }

  addHighlightFromSelection(
    selectionText: string,
    selectionRange: Range,
    color: string,
    startIndex: number, // New parameter
    endIndex: number // New parameter
  ): void {
    const markElement = this.renderer.createElement("mark");
    this.renderer.addClass(markElement, color);

    try {
      selectionRange.surroundContents(markElement);
    } catch (e) {
      console.warn(
        "Could not surround contents, possibly due to partial tag selection or empty range:",
        e
      );
      return;
    }

    const newHighlight = {
      text: selectionText,
      color: color,
      element: markElement,
      startIndex: startIndex,
      endIndex: endIndex
    };

    this.highlightSections.push(newHighlight);
    this.highlightSectionsChange.emit(this.highlightSections);
    console.log("Highlight added:", newHighlight);
    this.selectionApplied.emit({ // Emit new selection with indices
      text: selectionText,
      color: color,
      startIndex: startIndex,
      endIndex: endIndex
    });
    
    this.highlightSectionsChange.emit(this.highlightSections.map(e => e.text))
    this.cdr.detectChanges();

          

    this.applyHighlighting(markElement);
  }

  handleAutomaticHighlight(): void {
    const selection = document.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      // Check word count
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount > this.maxWordsToSelect) {
        this.toastService.show(`Can't select more than ${this.maxWordsToSelect} words.`, 3000);
        selection?.removeAllRanges(); // Clear selection
        return; // Do not add highlight
      }

      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (range) {
        const startElement =
          range.startContainer.nodeType === 3
            ? range.startContainer.parentNode
            : range.startContainer;
        const startComponent = (startElement as HTMLElement)?.closest(
          ".text-container"
        );

        if (startComponent && !selection.isCollapsed) {
          // Calculate start and end indices relative to the original textContent
          const textContainerElement = this.el.nativeElement.querySelector(".text-container");
          if (textContainerElement) {
              const fullText = textContainerElement.textContent || '';
              // Get start and end container paths for more robust index finding
              const rangeStartPath = this.getNodePath(range.startContainer, textContainerElement);
              const rangeEndPath = this.getNodePath(range.endContainer, textContainerElement);

              let startIndex = this.getAbsoluteOffset(textContainerElement, range.startContainer, range.startOffset);
              let endIndex = this.getAbsoluteOffset(textContainerElement, range.endContainer, range.endOffset);

              // Ensure startIndex and endIndex are within bounds and make sense
              if (startIndex === -1 || endIndex === -1) {
                  // Fallback for complex cases where absolute offset is hard to find
                  startIndex = this.textContent.indexOf(text);
                  endIndex = startIndex !== -1 ? startIndex + text.length : -1;
              } else {
                  // Adjust for potential HTML structure changes if textContent is flat
                  // This is a rough adjustment, a perfect match is hard without parsing HTML
                  const tempSelectionText = this.textContent.substring(startIndex, endIndex);
                  if (tempSelectionText !== text && this.textContent.indexOf(text) !== -1) {
                    startIndex = this.textContent.indexOf(text);
                    endIndex = startIndex + text.length;
                  }
              }

              if (startIndex !== -1 && endIndex !== -1) {
                  this.addHighlightFromSelection(text, range, this.highlightColor, startIndex, endIndex);
                  this.toastService.show('Selection added!', 2000); // Show toast
              } else {
                  console.warn("Could not determine accurate start/end indices for selection.");
              }
          }
          selection.removeAllRanges();
        }
      }
    }
  }

  // --- Utility functions for index calculation ---

  // Gets the path from a root element to a specific node (used for debugging/complex scenarios)
  private getNodePath(node: Node, root: HTMLElement): number[] {
      const path: number[] = [];
      let current: Node | null = node;
      while (current && current !== root) {
          const parent = current.parentNode;
          if (!parent) { break; }
          const index = 0;
          for (let i = 0; i < parent.childNodes.length; i++) {
              if (parent.childNodes[i] === current) {
                  path.unshift(i);
                  break;
              }
          }
          current = parent;
      }
      return path;
  }

  // Calculates the absolute character offset within the text content of a root element.
  // This is a common but tricky problem due to varying DOM structures (text nodes, elements).
  private getAbsoluteOffset(root: HTMLElement, node: Node, offset: number): number {
    let absoluteOffset = 0;
    const range = document.createRange();
    range.selectNodeContents(root);
    range.setEnd(node, offset);
    absoluteOffset = range.toString().length;

    // Handle cases where fullText might have different whitespace/HTML stripped by textContent
    // This is still an approximation, full accuracy requires deep DOM traversal matching.
    const normalizedSelectedText = range.toString().replace(/\s+/g, ' ').trim();
    const normalizedFullText = root.textContent?.replace(/\s+/g, ' ').trim() || '';

    // If the selected text and root text content are similar after normalization,
    // we can trust the range's length. Otherwise, a simple indexOf might be necessary
    // as a fallback if the DOM is too complex or non-text nodes are involved.
    // The previous range.toString().length is usually the best bet for pure text nodes.

    return absoluteOffset;
  }
}
