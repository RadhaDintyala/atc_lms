import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let bg = 'bg-[#F4F4F5]';
  let text = 'text-[#111111]';
  let border = 'border-[#E4E4E7]';
  let label = status;

  if (type === 'status' || type === 'topic') {
    switch (normalized) {
      case 'completed':
        bg = 'bg-[#111111]';
        text = 'text-white';
        border = 'border-[#111111]';
        label = 'Completed';
        break;
      case 'in_progress':
        bg = 'bg-[#F9C321]';
        text = 'text-[#111111]';
        border = 'border-[#E5B01D]';
        label = 'In Progress';
        break;
      case 'not_started':
        bg = 'bg-white';
        text = 'text-[#71717A]';
        border = 'border-[#E4E4E7]';
        label = 'Not Started';
        break;
      default:
        break;
    }
  } else if (type === 'project') {
    switch (normalized) {
      case 'completed':
      case 'approved':
        bg = 'bg-[#111111]';
        text = 'text-white';
        border = 'border-[#111111]';
        label = 'Approved';
        break;
      case 'under_review':
        bg = 'bg-[#FEF9E6]';
        text = 'text-[#111111]';
        border = 'border-[#F5D365]';
        label = 'Under Review';
        break;
      case 'submitted':
        bg = 'bg-[#FEF9E6]';
        text = 'text-[#111111]';
        border = 'border-[#F5D365]';
        label = 'Submitted';
        break;
      case 'changes_requested':
        bg = 'bg-[#F4F4F5]';
        text = 'text-[#111111] font-bold';
        border = 'border-[#111111]';
        label = 'Changes Requested';
        break;
      case 'in_progress':
      case 'draft':
        bg = 'bg-[#F9C321]';
        text = 'text-[#111111]';
        border = 'border-[#E5B01D]';
        label = normalized === 'draft' ? 'Draft' : 'In Progress';
        break;
      case 'not_started':
        bg = 'bg-white';
        text = 'text-[#71717A]';
        border = 'border-[#E4E4E7]';
        label = 'Not Started';
        break;
      default:
        break;
    }
  } else if (type === 'difficulty') {
    switch (normalized) {
      case 'beginner':
        bg = 'bg-[#F4F4F5]';
        text = 'text-[#111111]';
        border = 'border-[#E4E4E7]';
        label = 'Beginner';
        break;
      case 'intermediate':
        bg = 'bg-[#FEF9E6]';
        text = 'text-[#111111] font-semibold';
        border = 'border-[#F5D365]';
        label = 'Intermediate';
        break;
      case 'advanced':
        bg = 'bg-[#111111]';
        text = 'text-white font-semibold';
        border = 'border-[#111111]';
        label = 'Advanced';
        break;
    }
  } else if (type === 'account') {
    if (normalized === 'active') {
      bg = 'bg-[#111111]';
      text = 'text-white';
      border = 'border-[#111111]';
      label = 'Active';
    } else {
      bg = 'bg-[#F4F4F5]';
      text = 'text-[#71717A]';
      border = 'border-[#E4E4E7]';
      label = 'Inactive';
    }
  } else if (type === 'track') {
    switch (normalized) {
      case 'common':
        bg = 'bg-[#F4F4F5]';
        text = 'text-[#111111]';
        border = 'border-[#E4E4E7]';
        label = 'Common Foundation';
        break;
      case 'fullstack':
        bg = 'bg-white';
        text = 'text-[#111111] font-semibold';
        border = 'border-[#111111]';
        label = 'Full-Stack & App Dev';
        break;
      case 'ai':
        bg = 'bg-[#111111]';
        text = 'text-[#F9C321] font-semibold';
        border = 'border-[#111111]';
        label = 'AI Engineering';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${bg} ${text} ${border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80 shrink-0"></span>
      <span>{label}</span>
    </span>
  );
}
