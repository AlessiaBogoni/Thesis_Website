import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ElementRef, Renderer2, AfterViewInit } from "@angular/core";

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
  highlightSections: { text: string; color: string; element: HTMLElement }[] =
    [];
  @Input() textContent = "";
  @Output() highlightSectionsChange = new EventEmitter<
    string[]
  >();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.renderer.listen(document, "selectionchange", () => this.textSelect());
    this.renderer.listen(document, "mouseup", () =>
      this.handleAutomaticHighlight()
    );
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
      const startComponent = (startElement as HTMLElement).closest(
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
    color: string
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

    this.highlightSections.push({
      text: selectionText,
      color: color,
      element: markElement,
    });
    this.highlightSectionsChange.emit(this.highlightSections.map(e => e.text))
    this.cdr.detectChanges();

          

    this.applyHighlighting(markElement);
  }

  handleAutomaticHighlight(): void {
    const selection = document.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (range) {
        const startElement =
          range.startContainer.nodeType === 3
            ? range.startContainer.parentNode
            : range.startContainer;
        const startComponent = (startElement as HTMLElement).closest(
          ".text-container"
        );

        if (startComponent && !selection.isCollapsed) {
          this.addHighlightFromSelection(text, range, this.highlightColor);
          // Clear the selection after highlighting
          selection.removeAllRanges();
        }
      }
    }
  }
}
