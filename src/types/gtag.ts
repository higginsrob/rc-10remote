// Google Analytics gtag types
export interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  event_action?: string;
  action?: string;
  program?: number;
  name?: string;
  url?: string;
  kit?: string;
  shortcuts_cleared?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface GtagFunction {
  (command: 'event', action: string, params?: GtagEventParams): void;
  (command: 'config' | 'get' | 'set', ...args: (string | number | object)[]): void;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export {};