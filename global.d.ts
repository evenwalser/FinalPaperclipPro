// global.d.ts
export {};

declare global {
  interface Window {
    Square: any; // Replace `any` with a more specific type if you have one from Square's docs.
  }
}
