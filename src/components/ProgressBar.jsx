import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showPercentage = true,
  size = 'md',
  color = 'yellow', // 'yellow' | 'cyan' | 'emerald' | 'blue'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(((value || 0) / (max || 100)) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorGradients = {
    yellow: 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-200',
    cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-sm shadow-cyan-200',
    emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700">
          {label && <span className="truncate pr-2">{label}</span>}
          {showPercentage && <span className="font-mono text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorGradients[color] || colorGradients.yellow}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
