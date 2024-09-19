declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, MOUSE, Vector3 } from 'three';
    
    export class OrbitControls extends EventDispatcher {
      constructor(camera: Camera, domElement: HTMLElement);
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      target: Vector3;
  
      update(): void;
      dispose(): void;
    }
  }
  