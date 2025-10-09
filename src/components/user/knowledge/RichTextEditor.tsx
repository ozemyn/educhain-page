'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = '请输入内容...',
  minHeight = '300px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // 处理内容变化
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // 执行格式化命令
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // 插入链接
  const insertLink = () => {
    const url = prompt('请输入链接地址:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // 插入图片
  const insertImage = () => {
    const url = prompt('请输入图片地址:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  // 插入代码块
  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      const codeElement = document.createElement('pre');
      codeElement.className = 'bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto';
      const codeContent = document.createElement('code');
      codeContent.textContent = selectedText || '// 在这里输入代码';
      codeElement.appendChild(codeContent);
      
      range.deleteContents();
      range.insertNode(codeElement);
      
      // 清除选择
      selection.removeAllRanges();
      handleInput();
    }
  };

  // 工具栏按钮配置
  const toolbarButtons = [
    {
      icon: BoldIcon,
      command: 'bold',
      title: '粗体 (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: ItalicIcon,
      command: 'italic',
      title: '斜体 (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: UnderlineIcon,
      command: 'underline',
      title: '下划线 (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    {
      icon: ListBulletIcon,
      command: 'insertUnorderedList',
      title: '无序列表',
    },
    {
      icon: NumberedListIcon,
      command: 'insertOrderedList',
      title: '有序列表',
    },
    {
      icon: LinkIcon,
      command: 'link',
      title: '插入链接',
      action: insertLink
    },
    {
      icon: PhotoIcon,
      command: 'image',
      title: '插入图片',
      action: insertImage
    },
    {
      icon: CodeBracketIcon,
      command: 'code',
      title: '代码块',
      action: insertCodeBlock
    },
  ];

  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* 工具栏 */}
      <div className="border-b border-white/20 dark:border-white/10 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              title={button.title}
              onClick={() => {
                if (button.action) {
                  button.action();
                } else {
                  execCommand(button.command);
                }
              }}
            >
              <button.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          ))}
          
          {/* 标题格式选择 */}
          <div className="ml-2 border-l border-white/20 dark:border-white/10 pl-2">
            <select
              className="glass-input text-sm py-1 px-2"
              onChange={(e) => execCommand('formatBlock', e.target.value)}
              defaultValue=""
            >
              <option value="">正文</option>
              <option value="h1">标题 1</option>
              <option value="h2">标题 2</option>
              <option value="h3">标题 3</option>
              <option value="h4">标题 4</option>
              <option value="h5">标题 5</option>
              <option value="h6">标题 6</option>
            </select>
          </div>
        </div>
      </div>

      {/* 编辑器内容区域 */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 focus:outline-none text-gray-900 dark:text-white"
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsToolbarVisible(true)}
        onBlur={() => setIsToolbarVisible(false)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* 编辑器样式 */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.75rem;
          font-weight: bold;
          margin: 0.875rem 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        
        [contenteditable] h4 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.625rem 0;
        }
        
        [contenteditable] h5 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] h6 {
          font-size: 1rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
          border-radius: 0.5rem;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        
        .dark [contenteditable] pre {
          background-color: #374151;
        }
        
        [contenteditable] code {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 0.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .dark [contenteditable] blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}