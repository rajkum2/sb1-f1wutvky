import React from 'react';

interface CommandBarProps {
  children: React.ReactNode;
}

export const CommandBar: React.FC<CommandBarProps> = ({ children }) => {
  return (
    <div className="pa-command-bar">
      {children}
    </div>
  );
};

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}

export const CommandButton: React.FC<CommandButtonProps> = ({ 
  icon, 
  label, 
  onClick,
  disabled = false,
  primary = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : primary 
            ? 'bg-[var(--power-apps-primary)] text-white hover:bg-[var(--power-apps-primary-dark)]'
            : 'bg-white border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};