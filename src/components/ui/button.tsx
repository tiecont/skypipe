import * as React from "react";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/loading";

const buttonVariants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-secondary text-white hover:bg-secondary-dark",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    isLoading?: boolean;
    icon?: string;
    wIc?: number;
    hIc?: number;
    iconAlt?: string;
    iconClassName?: string;
    loadingSize?: number;
    loadingColor?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "primary",
            isLoading = false,
            icon,
            iconAlt = "icon",
            wIc = 20,
            hIc = 20,
            iconClassName = "",
            loadingSize = 20,
            loadingColor = "#ffffff",
            disabled,
            type = "button",
            ...props
        },
        ref
    ) => {
        return (
            <button
                type={type}
                className={cn(
                    "inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
                    buttonVariants[variant],
                    className
                )}
                disabled={isLoading || disabled}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <Loading stroke={loadingColor} width={loadingSize} />
                ) : (
                    <>
                        {icon && (
                            <img
                                src={icon}
                                width={wIc}
                                height={hIc}
                                alt={iconAlt}
                                className={cn(iconClassName, { "mr-2": children })}
                            />
                        )}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;