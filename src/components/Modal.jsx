import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop without artificial blur */}
      <div
        className="fixed inset-0 bg-[#111111]/70 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full ${maxWidth} border border-[#E4E4E7]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E4E4E7] px-6 py-4 bg-white">
            <h3 className="text-base font-bold text-[#111111] tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#111111] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[calc(85vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
