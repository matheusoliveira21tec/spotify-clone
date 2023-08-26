import React from 'react';
import { twMerge } from "tailwind-merge";

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
    // Classes de estilo do Tailwind CSS
    const tailwindClasses = `
        bg-neutral-900 
        rounded-lg 
        h-fit 
        w-full
    `;

    // Mesclar classes do Tailwind com classes personalizadas
    const mergedClasses = twMerge(tailwindClasses, className);

    return (
        <div className={mergedClasses}>
            {children}
        </div>
    );
}

export default Box;