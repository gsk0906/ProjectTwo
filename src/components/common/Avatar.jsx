import React, { useState } from 'react';

export const Avatar = ({
  src,
  name = 'User',
  initials,
  size = 'md',
  status,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-12 h-12 text-base font-bold',
  };

  const statusIndicatorClasses = {
    xs: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  // Generate pleasant deterministic background color for initials
  const getBgColor = (str) => {
    const colors = [
      'bg-indigo-600 text-white',
      'bg-blue-600 text-white',
      'bg-emerald-600 text-white',
      'bg-purple-600 text-white',
      'bg-amber-600 text-white',
      'bg-rose-600 text-white',
      'bg-cyan-600 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const computedInitials =
    initials ||
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() ||
    'U';

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`rounded-full object-cover border border-slate-200/60 shadow-xs ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-medium shadow-xs ${
            sizeClasses[size]
          } ${getBgColor(name)}`}
        >
          {computedInitials}
        </div>
      )}

      {status && (
        <span
          className={`absolute rounded-full ring-2 ring-white ${statusIndicatorClasses[size]} ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-300'
          }`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
