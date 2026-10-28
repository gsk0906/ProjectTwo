import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Logo = ({ size = 'md', showTagline = false, className = '' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xs ${
          isSm ? 'w-7 h-7 rounded-lg' : isLg ? 'w-10 h-10' : 'w-8 h-8'
        }`}
      >
        <ShieldCheck className={isSm ? 'w-4 h-4' : isLg ? 'w-6 h-6' : 'w-5 h-5'} strokeWidth={2.4} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-bold tracking-tight text-slate-900 ${
              isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'
            }`}
          >
            Resolve
          </span>
          <span
            className={`font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 tracking-wide border border-indigo-100/80 ${
              isSm ? 'text-[10px]' : isLg ? 'text-sm' : 'text-xs'
            }`}
          >
            HQ
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-medium tracking-tight mt-1">
            Every issue deserves a resolution.
          </span>
        )}
      </div>
    </div>
  );
};
