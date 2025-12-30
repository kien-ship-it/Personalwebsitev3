import React from 'react';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "The Future of Interface Design is Invisible",
    date: "Dec 2024",
    readTime: "5 min read",
    link: "#"
  },
  {
    id: 2,
    title: "Building Scalable Design Systems with Tailwind v4",
    date: "Nov 2024",
    readTime: "8 min read",
    link: "#"
  },
  {
    id: 3,
    title: "Why Micro-interactions Matter",
    date: "Oct 2024",
    readTime: "4 min read",
    link: "#"
  },
  {
    id: 4,
    title: "Accessibility as a Creative Constraint",
    date: "Sep 2024",
    readTime: "6 min read",
    link: "#"
  }
];

export function Writing() {
  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6">Writing</h2>
          <p className="text-neutral-500 max-w-xs mb-8">
            Thoughts on design, engineering, and the spaces in between.
          </p>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          {articles.map((article) => (
            <a 
                key={article.id} 
                href={article.link}
                className="group block border-b border-neutral-900 pb-8 last:border-0"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-light text-neutral-300 group-hover:text-white transition-colors duration-300">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-600 font-mono whitespace-nowrap">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                    <span>{article.readTime}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-red-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm font-medium">
                Read Article <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
