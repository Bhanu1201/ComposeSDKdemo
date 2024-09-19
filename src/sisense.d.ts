// src/sisense.d.ts
declare class SisenseFrame {
  constructor(config: {
    url: string;
    wat: string;
    dashboard: string;
    settings: {
      showToolbar: boolean;
      showLeftPane: boolean;
      showRightPane: boolean;
    };
    id: string | null;
  });

}
// src/sisense.d.ts
interface Window {
  SisenseFrame: typeof SisenseFrame;
}