/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare const THREE: typeof import('three');
declare const TWEEN: typeof import("./types/tween");

declare const Bol3D = {
  ...THREE,
  TWEEN,
};
