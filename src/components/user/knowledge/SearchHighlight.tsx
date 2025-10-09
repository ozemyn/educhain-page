'use client';

interface SearchHighlightProps {
  text: string;
  searchQuery?: string;
  className?: string;
}

export function SearchHighlight({ text, searchQuery, className = '' }: SearchHighlightProps) {
  if (!searchQuery || !searchQuery.trim()) {
    return <span className={className}>{text}</span>;
  }

  // 创建正则表达式，忽略大小写
  const regex = new RegExp(`(${searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}