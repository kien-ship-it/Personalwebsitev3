import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isPointerRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use transform for GPU-accelerated positioning (no layout thrashing)
    const updateCursor = (e: MouseEvent) => {
      // Direct DOM manipulation - bypasses React entirely for zero lag
      cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;

      // Check clickable state without triggering re-renders
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isClickable !== isPointerRef.current) {
        isPointerRef.current = isClickable;
        cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0) scale(${isClickable ? 1.5 : 1})`;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('mousemove', updateCursor, { passive: true });
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full pointer-events-none z-[9999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      />
    </>
  );
}
