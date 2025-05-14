import * as React from "react";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/loading";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
                                className={iconClassName}
                            />
                        )}
                        {children && (
                            <span className="ml-2">
                {children}
              </span>
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
