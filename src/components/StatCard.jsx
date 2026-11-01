import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'neutral',
  onClick,
  className = '',
}) {
  const getBadgeClass = (color) => {
    switch (color) {
      case 'amber':
      case 'yellow':
        return 'bg-[#F9C321] text-[#111111] border-[#E5B01D] font-bold';
      case 'emerald':
      case 'dark':
      case 'black':
        return 'bg-[#111111] text-white border-[#111111] font-semibold';
      case 'cyan':
      case 'blue':
      case 'purple':
      case 'rose':
      case 'slate':
      case 'neutral':
      default:
        return 'bg-[#F4F4F5] text-[#111111] border-[#E4E4E7] font-semibold';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs transition-all hover:border-[#111111] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-1.5 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] font-mono leading-none">
              {value}
            </span>
            {badge && (
              <span className={`text-[11px] px-2 py-0.5 rounded-md border ${getBadgeClass(badgeColor)}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#71717A] mt-2 flex items-center gap-1 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365]/60 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[#111111]" />
          </div>
        )}
      </div>
    </div>
  );
}
