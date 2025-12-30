import React from 'react';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-500">
      <div className="flex items-center gap-6">
        <span>Made with sweat, tears, and 4 cans of CELSIUS®</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Created with Figma and Kiro in Mcoy computer room at 2AM:)))</span>
      </div>
    </footer>
  );
}
