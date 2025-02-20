// global.d.ts
export {};

declare global {
  interface Window {
    pendo?: {
      initialize: (config: { 
        visitor: { id: string; email?: string; [key: string]: any },
        account?: { id: string; [key: string]: any }
      }) => void;
      identify?: (config: any) => void;
      updateOptions?: (config: any) => void;
      pageLoad?: () => void;
      track?: (event: string, properties?: Record<string, any>) => void;
      // add other methods as needed
    };
  }
}