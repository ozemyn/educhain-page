'use client';

import { useState, useRef } from 'react';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // bytes
  acceptedTypes?: string[];
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['*/*']
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return PhotoIcon;
    }
    return DocumentIcon;
  };

  // 验证文件
  const validateFile = (file: File): string | null => {
    // 检查文件大小
    if (file.size > maxFileSize) {
      return `文件 "${file.name}" 超过大小限制 (${formatFileSize(maxFileSize)})`;
    }

    // 检查文件类型
    if (acceptedTypes.length > 0 && !acceptedTypes.includes('*/*')) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return `文件 "${file.name}" 类型不支持`;
      }
    }

    return null;
  };

  // 处理文件选择
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // 检查文件数量限制
    if (files.length + selectedFiles.length > maxFiles) {
      newErrors.push(`最多只能上传 ${maxFiles} 个文件`);
      setErrors(newErrors);
      return;
    }

    // 验证每个文件
    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        // 检查是否已存在同名文件
        const isDuplicate = files.some(existingFile => existingFile.name === file.name);
        if (isDuplicate) {
          newErrors.push(`文件 "${file.name}" 已存在`);
        } else {
          validFiles.push(file);
        }
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  // 移除文件
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  // 拖拽处理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // 点击上传
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`glass-card border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/20 dark:bg-blue-900/20'
            : 'border-white/30 dark:border-white/20 hover:border-white/50 dark:hover:border-white/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="p-8 text-center cursor-pointer">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            点击上传或拖拽文件到此处
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            支持多种文件格式，单个文件不超过 {formatFileSize(maxFileSize)}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            最多可上传 {maxFiles} 个文件
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="glass-card p-4 border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-red-700 dark:text-red-400 mb-1">
                上传失败
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 已选择的文件列表 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            已选择文件 ({files.length}/{maxFiles})
          </div>
          <div className="space-y-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <div
                  key={index}
                  className="glass-card p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-3 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    title="移除文件"
                  >
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 支持的文件类型提示 */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div className="font-medium mb-1">支持的文件类型：</div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">图片</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">PDF</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Word</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Excel</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">PowerPoint</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">文本</span>
        </div>
      </div>
    </div>
  );
}