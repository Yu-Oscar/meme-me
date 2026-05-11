declare module "gifenc" {
  export type GifPalette = number[][];

  export interface GIFEncoderHandle {
    reset(): void;
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    readonly buffer: ArrayBuffer;
    writeHeader(): void;
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        transparent?: boolean;
        transparentIndex?: number;
        delay?: number;
        palette?: GifPalette | null;
        repeat?: number;
        colorDepth?: number;
        dispose?: number;
        first?: boolean;
      },
    ): void;
  }

  export function GIFEncoder(options?: {
    initialCapacity?: number;
    auto?: boolean;
  }): GIFEncoderHandle;

  export function quantize(
    data: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: {
      format?: "rgb565" | "rgb444" | "rgba4444";
      clearAlpha?: boolean;
      clearAlphaColor?: number;
      clearAlphaThreshold?: number;
      oneBitAlpha?: boolean | number;
      useSqrt?: boolean;
    },
  ): GifPalette;

  export function applyPalette(
    data: Uint8Array | Uint8ClampedArray,
    palette: GifPalette,
    format?: "rgb565" | "rgb444" | "rgba4444",
  ): Uint8Array;
}
