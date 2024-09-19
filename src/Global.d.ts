// global.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Global declarations for Sisense SDK
declare global {
  interface Window {
    sisense: {
      embed: {
        SisenseFrame: new (options: {
          url: string;
          dashboard: string;
          wat?: string;
          settings?: {
            showToolbar?: boolean;
            showLeftPane?: boolean;
            showRightPane?: boolean;
          };
          id?: string;
        }) => {
          render: (container?: HTMLElement) => Promise<void>;
        };
      };
    };
  }
}
