import SearchField from "@/components/shared/search-field"
import iconSearch from "@/icons/search.svg"

const SearchTextField = ({ value, onChange }:{value: string, onChange: (value: string) => void}) => {
    return (
        <SearchField
            placeholder="Type here to search..."
            value={value}
            onChange={onChange}
            icon={iconSearch}
        />
    )
}

export default SearchTextField