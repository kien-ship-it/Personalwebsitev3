/**
 * Vite plugin to handle API routes locally during development.
 * This allows the same API handlers to work both locally and when deployed to Vercel.
 */
import type { Plugin } from 'vite';
export declare function viteApiPlugin(): Plugin;
