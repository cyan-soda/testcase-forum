import {
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const DropdownSearchField = ({
    items,
    value,
    onChange,
    icon,
    placeholder,
}: {
    items: string[];
    value: string[];
    onChange: (value: string[]) => void;
    icon: string;
    placeholder?: string;
}) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<string | undefined>("auto");

    // Update dropdown width to match trigger width
    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(`${triggerRef.current.offsetWidth}px`);
        }
    }, [open]);

    const handleTagClick = (tag: string) => {
        const newSelection = value.includes(tag)
            ? value.filter((t) => t !== tag)
            : [...value, tag];
        onChange(newSelection);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                ref={triggerRef}
                className="w-full px-5 py-3 flex flex-row items-center bg-grey text-gray-400 rounded-lg focus-within:border-black focus-within:border"
            >
                <div className="flex flex-grow text-sm font-normal bg-grey focus:outline-none text-left">
                    {value.length > 0 ? value.join(", ") : placeholder}
                </div>
                <Image src={icon} alt="" className="cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-white shadow-md rounded-md p-2 flex flex-col gap-2"
                align="start" 
                style={{ width: triggerWidth }} 
            >
                {items.map((item, index) => (
                    <DropdownMenuItem
                        key={index}
                        className={`w-full px-5 py-2 flex items-center rounded-lg cursor-pointer ${
                            value.includes(item) ? "bg-black text-white" : "bg-grey text-black"
                        }`}
                        onSelect={(e) => e.preventDefault()} 
                        onClick={() => handleTagClick(item)}
                    >
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownSearchField;
