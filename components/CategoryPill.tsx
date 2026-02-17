import React from 'react';
import { CategoryType } from '../types';

interface CategoryPillProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  color: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, icon, isActive, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-3 min-w-[80px] rounded-2xl transition-all duration-300
        ${isActive 
          ? 'bg-slate-900 text-white shadow-lg scale-105' 
          : 'bg-white hover:bg-slate-50 text-slate-600 hover:shadow-md border border-slate-100'
        }
      `}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-white/10' : color}`}>
        {icon}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};
