/**
 * CyberButton Component
 * Reusable button with cyberpunk styling and cut corners
 */

import React from 'react';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'cyan' | 'pink' | 'green' | 'alert';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function CyberButton({
  children,
  onClick,
  type = 'button',
  variant = 'cyan',
  disabled = false,
  className = '',
  fullWidth = false,
}: CyberButtonProps) {
  const variantClasses = {
    cyan: 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-void hover:shadow-cyber-cyan',
    pink: 'border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-cyber-void hover:shadow-cyber-pink',
    green: 'border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-void hover:shadow-cyber-green',
    alert: 'border-cyber-alert text-cyber-alert hover:bg-cyber-alert hover:text-cyber-void hover:shadow-cyber-alert',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        cyber-button
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
