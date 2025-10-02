import React from 'react';

// Card Components
export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
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
  onClick,
  type = "button",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
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
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
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
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  ...props 
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Textarea Component
export const Textarea = ({ 
  className = "", 
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  ...props 
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    required={required}
    disabled={disabled}
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Label Component
export const Label = ({ 
  children,
  className = "", 
  htmlFor,
  ...props 
}) => (
  <label
    htmlFor={htmlFor}
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
    default: "bg-blue-100 text-blue-800 border-blue-200",
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
    className={`relative w-full rounded-lg border border-gray-200 p-4 ${className}`}
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
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => {
        if (!child) return null;
        return React.cloneElement(child, { 
          value, 
          onValueChange, 
          disabled,
          isOpen,
          setIsOpen
        });
      })}
    </div>
  );
};

export const SelectTrigger = ({ 
  children, 
  className = "",
  value,
  isOpen,
  setIsOpen,
  ...props 
}) => {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen && setIsOpen(!isOpen)}
      {...props}
    >
      <span className="block truncate">
        {React.Children.toArray(children).find(child => child.type === SelectValue) || children}
      </span>
      <svg
        className="h-4 w-4 opacity-50 ml-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};


export const SelectValue = ({ placeholder, value }) => {
  // This needs to be handled by the parent Select component
  return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ 
  children, 
  className = "",
  value,
  onValueChange,
  isOpen,
  setIsOpen,
  ...props 
}) => {
  if (!isOpen) return null;
  
  return (
    <div
      className={`absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white text-gray-950 shadow-md ${className}`}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child => {
          if (!child) return null;
          return React.cloneElement(child, { 
            selectedValue: value, 
            onSelect: (newValue) => {
              onValueChange?.(newValue);
              setIsOpen?.(false);
            }
          });
        })}
      </div>
    </div>
  );
};

export const SelectItem = ({ 
  children, 
  value, 
  selectedValue,
  onSelect,
  className = "",
  ...props 
}) => (
  <div
    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${selectedValue === value ? 'bg-gray-100 font-medium' : ''} ${className}`}
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
  <div className={className} {...props}>
    {React.Children.map(children, child => {
      if (!child) return null;
      return React.cloneElement(child, { value, onValueChange });
    })}
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
    {React.Children.map(children, child => {
      if (!child) return null;
      return React.cloneElement(child, { 
        selectedValue: value, 
        onSelect: onValueChange 
      });
    })}
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
        : 'hover:bg-gray-200 hover:text-gray-900'
    } ${className}`}
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </button>
);

// Export all components as default for easy importing
export default {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Label,
  Badge,
  Alert,
  AlertDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger
};