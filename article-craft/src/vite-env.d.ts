/// <reference types="vite/client" />

declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: any[];
  }
  export function convertToMarkdown(input: { arrayBuffer: ArrayBuffer } | { buffer: any }): Promise<MammothResult>;
  export function extractRawText(input: { arrayBuffer: ArrayBuffer } | { buffer: any }): Promise<MammothResult>;
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer } | { buffer: any }): Promise<MammothResult>;
}
