import React from 'react';

// Card Components
export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Button Component
export const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  className = "", 
  type = "text",
  ...props 
}) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Textarea Component
export const Textarea = ({ 
  className = "", 
  ...props 
}) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Label Component
export const Label = ({ 
  children,
  className = "", 
  ...props 
}) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

// Badge Component
export const Badge = ({ 
  children, 
  variant = "default",
  className = "", 
  ...props 
}) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
    outline: "border border-gray-300 bg-white"
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Alert Components
export const Alert = ({ 
  children, 
  className = "", 
  ...props 
}) => (
  <div
    className={`relative w-full rounded-lg border p-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const AlertDescription = ({ 
  children, 
  className = "", 
  ...props 
}) => (
  <div
    className={`text-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Select Components
export const Select = ({ 
  children, 
  value, 
  onValueChange, 
  ...props 
}) => {
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

export const SelectTrigger = ({ 
  children, 
  className = "",
  value,
  onValueChange,
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <>
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full">
          {React.Children.map(children, child => 
            child.type === SelectContent ? React.cloneElement(child, { 
              value, 
              onValueChange: (newValue) => {
                onValueChange?.(newValue);
                setIsOpen(false);
              }
            }) : null
          )}
        </div>
      )}
    </>
  );
};

export const SelectValue = ({ placeholder, value }) => (
  <span>{value || placeholder}</span>
);

export const SelectContent = ({ 
  children, 
  className = "",
  value,
  onValueChange,
  ...props 
}) => (
  <div
    className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-950 shadow-md ${className}`}
    {...props}
  >
    <div className="p-1">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          selectedValue: value, 
          onSelect: onValueChange 
        })
      )}
    </div>
  </div>
);

export const SelectItem = ({ 
  children, 
  value, 
  selectedValue,
  onSelect,
  className = "",
  ...props 
}) => (
  <div
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 ${selectedValue === value ? 'bg-gray-100' : ''} ${className}`}
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </div>
);

// Tabs Components  
export const Tabs = ({ 
  children, 
  value, 
  onValueChange,
  className = "",
  ...props 
}) => (
  <div className={`${className}`} {...props}>
    {React.Children.map(children, child => 
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

export const TabsList = ({ 
  children, 
  className = "",
  value,
  onValueChange,
  ...props 
}) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    {...props}
  >
    {React.Children.map(children, child => 
      React.cloneElement(child, { 
        selectedValue: value, 
        onSelect: onValueChange 
      })
    )}
  </div>
);

export const TabsTrigger = ({ 
  children, 
  value, 
  selectedValue,
  onSelect,
  className = "",
  ...props 
}) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      selectedValue === value 
        ? 'bg-white text-gray-950 shadow-sm' 
        : 'hover:bg-gray-200'
    } ${className}`}
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </button>
);
