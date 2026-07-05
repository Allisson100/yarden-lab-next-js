export {};

declare global {
  interface Window {
    // Cloudflare Turnstile — API injetada pelo <script> externo do Cloudflare
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: Record<string, unknown>,
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}
