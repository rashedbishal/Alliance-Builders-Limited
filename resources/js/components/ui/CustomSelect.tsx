import { ChevronDown, Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

export interface CustomSelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: CustomSelectOption[];
    triggerClassName?: string;
    contentClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onValueChange,
    placeholder,
    options,
    triggerClassName,
    contentClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer transition-colors duration-300",
                    triggerClassName
                )}
            >
                <span className={cn("truncate text-white", !selectedOption && "text-white/70")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 text-white transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-white text-black shadow-md animate-in fade-in-0 zoom-in-95",
                        contentClassName
                    )}
                >
                    {options.length === 0 ? (
                        <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
                    ) : (
                        options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onValueChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none hover:bg-accent/20 hover:text-accent-foreground transition-colors duration-150 text-white",
                                        isSelected && "bg-white/20 font-medium"
                                    )}
                                >
                                    {isSelected && (
                                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </span>
                                    )}
                                    <span>{option.label}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
