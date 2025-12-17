import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-neon-blue text-black hover:bg-neon-blue/90': variant === 'primary',
                        'bg-zinc-800 text-white hover:bg-zinc-700': variant === 'secondary',
                        'border border-zinc-700 bg-transparent hover:bg-zinc-800': variant === 'outline',
                        'hover:bg-zinc-800 text-zinc-400 hover:text-white': variant === 'ghost',
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
