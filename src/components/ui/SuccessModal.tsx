'use client';

import { useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessModalProps {
  message: string;
  onClose: () => void;
  isOpen?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessModal({ 
  message, 
  onClose, 
  isOpen = true, 
  autoClose = true, 
  autoCloseDelay = 3000 
}: SuccessModalProps) {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                操作成功
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="glass-button bg-green-500/20 text-green-600 dark:text-green-400"
            >
              确定
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}