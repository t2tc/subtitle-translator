import React from "react";

function createStyledComponent<T extends React.ComponentType<any & { className: string | undefined }>>(component: T, predefinedClassName: string, predefinedStyle?: React.CSSProperties) {
    const StyledComponent = React.forwardRef<React.ElementRef<T>, React.ComponentPropsWithoutRef<T>>(
        ({ className, ...props }, ref) => {
            return React.createElement(component, {
                ...props,
                ref,
                className: `${predefinedClassName} ${className || ''}`,
                style: predefinedStyle,
            });
        }
    );
    StyledComponent.displayName = `(Styled)${component.displayName}`;
    return StyledComponent;
}

function createStyledElement<T extends keyof JSX.IntrinsicElements>(component: T, predefinedClassName: string, predefinedStyle?: React.CSSProperties) {
    const StyledComponent = React.forwardRef<React.ElementRef<T>, React.ComponentPropsWithoutRef<T>>(
        ({ className, ...props }, ref) => {
            return React.createElement(component, {
                ...props,
                ref,
                className: `${predefinedClassName} ${className || ''}`,
                style: predefinedStyle,
            });
        }
    );
    StyledComponent.displayName = `(Styled)${component}`;
    return StyledComponent;
}

export {
    createStyledComponent,
    createStyledElement,
}