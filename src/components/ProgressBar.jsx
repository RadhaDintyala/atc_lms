import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showPercentage = true,
  size = 'md',
  color = 'yellow', // 'yellow' | 'dark' | 'neutral'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(((value || 0) / (max || 100)) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  // Modern solid architectural fills
  const getFillClass = (col) => {
    switch (col) {
      case 'dark':
      case 'black':
        return 'bg-[#111111]';
      case 'neutral':
        return 'bg-[#71717A]';
      case 'yellow':
      default:
        return 'bg-[#F9C321]';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-[#111111]">
          {label && <span className="truncate pr-2 text-[#71717A] font-medium">{label}</span>}
          {showPercentage && <span className="font-mono text-[#111111] font-bold">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#F4F4F5] rounded-sm overflow-hidden border border-[#E4E4E7] ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full transition-all duration-300 ease-out rounded-sm ${getFillClass(color)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
