import React from 'react';

/**
 * Simple markdown parser for chat messages
 * Handles bold text and bullet points with red styling
 */

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  // Split by lines to handle bullet points
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Check for bullet points
    if (line.trim().match(/^(\*|-|\+)\s+/)) {
      // Extract the bullet content
      const content = line.trim().replace(/^(\*|-|\+)\s+/, '');
      elements.push(
        <div key={`line-${lineIndex}`} className="flex items-start gap-2 mb-1">
          <span className="text-red-500 mt-0.5">•</span>
          <span>{parseInlineMarkdown(content, `inline-${lineIndex}`)}</span>
        </div>
      );
    } else {
      // Regular line with inline markdown
      const parsedLine = parseInlineMarkdown(line, `line-${lineIndex}`);
      if (lineIndex < lines.length - 1) {
        elements.push(
          <React.Fragment key={`fragment-${lineIndex}`}>
            {parsedLine}
            <br />
          </React.Fragment>
        );
      } else {
        elements.push(parsedLine);
      }
    }
  });

  return elements.length > 1 ? <>{elements}</> : elements[0];
}

/**
 * Parse inline markdown (bold text)
 */
function parseInlineMarkdown(text: string, keyPrefix: string = ''): React.ReactNode {
  if (!text) return text;

  // Handle incomplete bold tags during streaming
  const parts = text.split(/(\*\*[^*]*\*\*|\*\*[^*]*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        const uniqueKey = `${keyPrefix}-${index}`;
        if (part.startsWith('**') && part.endsWith('**')) {
          // Complete bold tag
          const content = part.slice(2, -2);
          return (
            <span key={uniqueKey} className="text-red-500 font-semibold">
              {content}
            </span>
          );
        } else if (part.startsWith('**') && !part.endsWith('**')) {
          // Incomplete bold tag (streaming)
          const content = part.slice(2);
          return (
            <span key={uniqueKey} className="text-red-500 font-semibold">
              {content}
            </span>
          );
        }
        return <span key={uniqueKey}>{part}</span>;
      })}
    </>
  );
}
