import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    hideChevron?: boolean
    selected?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    responsiveChevron?: boolean
}

const Button: FC<ButtonProps> = ({
    onClick,
    children,
    style,
    hideChevron,
    selected,
    leftIcon,
    rightIcon,
    responsiveChevron,
    ...props
}) => (
    <button
        style={{
            ...style,
        }}
        {...props}
        className={`${props.className} ${selected ? "selected" : ""} ${props.disabled ? "disabled" : "text-white md:hover:bg-charcoal md:bg-raisin-black "}`}
        onClick={onClick}
    >
        <div className="flex items-center gap-2">
            {leftIcon}
            {children}
        </div>

        {(!hideChevron || rightIcon) && (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transform transition-transform duration-400 ease-in-out ${selected ? "rotate-90" : ""
                    } ${responsiveChevron ? "md:hidden" : ""}`}
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        )}

        {rightIcon && <div>{rightIcon}</div>}
    </button>
)

export { Button }