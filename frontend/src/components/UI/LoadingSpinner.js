import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-blue-500', 
        white: 'border-white',
    gray: 'border-gray-400' 
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-1", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <p className="mt-1 text-sm text-gray-700 text-center">{text}</p> // adjusted margin and text color
      )}
    </div>
  );
};

export default LoadingSpinner;
