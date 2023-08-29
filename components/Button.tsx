// Importando a função `forwardRef` do pacote 'react' e a função `twMerge` do pacote 'tailwind-merge'
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Definindo a interface para as props do componente Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

// Definindo o componente Button utilizando `forwardRef`
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = 'button',
    ...props
}, ref) => {
    // Retornando o elemento de botão com estilos do Tailwind CSS e outras propriedades
    return (
        <button
            type={type}
            className={twMerge(
                // Estilos base do botão utilizando tailwind-merge
                `
        w-full 
        rounded-full 
        bg-green-500
        border
        border-transparent
        px-3 
        py-3 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        text-black
        font-bold
        hover:opacity-75
        transition
      `,
                // Estilos adicionais para botões desativados
                disabled && 'opacity-75 cursor-not-allowed',
                // Classe de estilo fornecida via prop `className`
                className
            )}
            // Propriedade `disabled` do botão
            disabled={disabled}
            // Referência do botão repassada via `forwardRef`
            ref={ref}
            // Repassando todas as outras propriedades para o elemento de botão
            {...props}
        >
            {children} {/* Conteúdo interno do botão (texto ou outros elementos) */}
        </button>
    );
});

// Definindo o nome a ser mostrado no DevTools (facilita a depuração)
Button.displayName = "Button";

// Exportando o componente Button como padrão
export default Button;