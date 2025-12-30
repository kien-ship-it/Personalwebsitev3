import React from 'react';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400">
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-white transition-colors">Terms & Code of Conduct</a>
      </div>

      <div className="flex items-center gap-2">
        <span>Supported by</span>
        <Zap className="w-3 h-3 text-red-500 fill-current" />
      </div>
    </footer>
  );
}
