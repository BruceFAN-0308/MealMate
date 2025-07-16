import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

export default function PageContainer({ 
  children, 
  className = '', 
  maxWidth = '7xl' 
}: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  }[maxWidth];

  return (
    <div className={`${maxWidthClass} mx-auto px-8 py-8 ${className}`}>
      {children}
    </div>
  );
} 