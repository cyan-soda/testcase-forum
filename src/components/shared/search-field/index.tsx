import Image from "next/image";

const SearchField = ({
    placeholder,
    value,
    onChange,
    icon,
}:{
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    icon: string;
}) => {
    return (
        <div className={`w-full px-5 py-3 flex flex-row items-center bg-grey text-black rounded-lg focus-within:border-black focus-within:border`}>
            <input 
                className={`w-full flex-grow text-sm font-normal bg-grey focus:outline-none`}
                placeholder={placeholder}
            />
            <Image src={icon} alt="" className="cursor-pointer" />
        </div>
    )
}

export default SearchField