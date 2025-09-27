// src/app/cst/cst-config.ts

// Selectors for HTML elements that should be tracked as individual sub-elements for heatmaps
// Add or remove elements based on your content structure and desired granularity.
export const CST_HEATMAP_SUB_ELEMENT_SELECTORS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', '.cst-track-inline', // '.cst-track-inline' for custom inline elements
  'blockquote', 'pre', 'code', // Common block-level text elements
];

// Threshold for IntersectionObserver to consider a sub-element "visible" for dwell time tracking.
// e.g., 0.5 means at least 50% of the element must be visible.
export const CST_HEATMAP_INTERSECTION_THRESHOLD = 0.5;

// Debounce time for scroll and mouseup events (milliseconds)
export const CST_EVENT_DEBOUNCE_TIME = 100;

// Throttle time for mouseenter events (milliseconds) for mouse heatmaps
export const CST_MOUSE_ENTER_THROTTLE_TIME = 50;

// Base color scale for the heatmap gradient (e.g., light blue to red)
// You'll need `chroma-js` for this.
export const CST_HEATMAP_COLOR_SCALE = ['#ADD8E6', '#FF6347']; // Light Blue to Tomato Red

// src/app/cst/cst.types.ts

// Define CST Configuration and Weights (re-defined for clarity, can be imported from cst.service)
export interface CstWeights {
  scrollDepth: number;
  scrollEfficiency: number;
  dwellTime: number;
  activeWindow: number;
  copyPaste: number;
  textSelection: number;
  typingActivity: number;
  attentionCheck: number;
  anomalyDetection: number;
}

export interface CstConfig {
  weights: CstWeights;
  scrollDebounceMs: number;
  dwellTimeThrottleMs: number;
  activeWindowCheckIntervalMs: number;
  minTypingSpeedCPM: number;
}

// NEW: Interface for individual sub-elements within a tracked container
export interface CstSubElementData {
  id: string; // Unique ID for the sub-element (e.g., 'containerId-p-0')
  nativeElement: HTMLElement; // Reference to the actual DOM element
  cumulativeVisibleTime: number; // in ms, for dwell heatmap
  lastVisibilityChangeTime: number | null; // Timestamp when visibility changed
  isVisible: boolean; // Current visibility state
  hasSelectedText: boolean; // For selection heatmap
  hasCopiedText: boolean; // For copy heatmap
  mouseEnterCount: number; // For mouse hover heatmap (proxy for attention)
  // Add more granular metrics here if needed (e.g., clicks on internal links within sub-element)
}

// UPDATED: Interface for the overall container data, now including sub-elements
export interface CstContainerData {
  element: HTMLElement; // Reference to the main container element
  totalDwellTime: number; // Overall container dwell time (from original code)
  lastVisibilityChange: number;
  id: string;
  isVisible: boolean;
  scrollEvents: { scrollTop: number; timestamp: number }[];
  maxScrollDepth: number; // Normalized 0-1
  scrollDirectionChanges: number;
  scrollCount: number;
  typingActivityCount: number;
  hasCopied: boolean; // Overall container copy
  hasSelected: boolean; // Overall container selection
  attentionCheckScore: number;
  anomalyDetected: boolean;
  subElements: Map<string, CstSubElementData>; // NEW: Map of sub-element data
}

// Interface for the calculated scores of a container (similar to original output)
export interface CstCalculatedScores {
  id: string;
  scrollDepthScore: number;
  scrollEfficiencyScore: number;
  dwellTimeScore: number;
  activeWindowScore: number;
  copyPasteScore: number;
  textSelectionScore: number;
  typingActivityScore: number;
  attentionCheckScore: number;
  anomalyDetectionScore: number;
  overallCST: number;
}
