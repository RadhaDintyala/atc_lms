import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let bg = 'bg-slate-100';
  let text = 'text-slate-700';
  let border = 'border-slate-200';
  let label = status;

  if (type === 'status' || type === 'topic') {
    switch (normalized) {
      case 'completed':
        bg = 'bg-emerald-50';
        text = 'text-emerald-700';
        border = 'border-emerald-200';
        label = 'Completed';
        break;
      case 'in_progress':
        bg = 'bg-amber-50';
        text = 'text-amber-800';
        border = 'border-amber-200';
        label = 'In Progress';
        break;
      case 'not_started':
        bg = 'bg-slate-100';
        text = 'text-slate-600';
        border = 'border-slate-200';
        label = 'Not Started';
        break;
      default:
        break;
    }
  } else if (type === 'project') {
    switch (normalized) {
      case 'approved':
        bg = 'bg-emerald-50';
        text = 'text-emerald-700';
        border = 'border-emerald-200';
        label = 'Approved';
        break;
      case 'under_review':
        bg = 'bg-blue-50';
        text = 'text-blue-700';
        border = 'border-blue-200';
        label = 'Under Review';
        break;
      case 'submitted':
        bg = 'bg-cyan-50';
        text = 'text-cyan-800';
        border = 'border-cyan-200';
        label = 'Submitted';
        break;
      case 'changes_requested':
        bg = 'bg-rose-50';
        text = 'text-rose-700';
        border = 'border-rose-200';
        label = 'Changes Requested';
        break;
      case 'draft':
        bg = 'bg-slate-100';
        text = 'text-slate-600';
        border = 'border-slate-200';
        label = 'Draft';
        break;
      default:
        break;
    }
  } else if (type === 'difficulty') {
    switch (normalized) {
      case 'beginner':
        bg = 'bg-emerald-50';
        text = 'text-emerald-700';
        border = 'border-emerald-200';
        label = 'Beginner';
        break;
      case 'intermediate':
        bg = 'bg-amber-50';
        text = 'text-amber-800';
        border = 'border-amber-200';
        label = 'Intermediate';
        break;
      case 'advanced':
        bg = 'bg-purple-50';
        text = 'text-purple-700';
        border = 'border-purple-200';
        label = 'Advanced';
        break;
    }
  } else if (type === 'account') {
    if (normalized === 'active') {
      bg = 'bg-emerald-50';
      text = 'text-emerald-700';
      border = 'border-emerald-200';
      label = 'Active';
    } else {
      bg = 'bg-slate-100';
      text = 'text-slate-500';
      border = 'border-slate-300';
      label = 'Inactive';
    }
  } else if (type === 'track') {
    switch (normalized) {
      case 'common':
        bg = 'bg-slate-100';
        text = 'text-slate-800';
        border = 'border-slate-300';
        label = 'Common Foundation';
        break;
      case 'fullstack':
        bg = 'bg-blue-50';
        text = 'text-blue-800';
        border = 'border-blue-200';
        label = 'Full-Stack & App Dev';
        break;
      case 'ai':
        bg = 'bg-purple-50';
        text = 'text-purple-800';
        border = 'border-purple-200';
        label = 'AI Engineering';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${text} ${border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {label}
    </span>
  );
}
