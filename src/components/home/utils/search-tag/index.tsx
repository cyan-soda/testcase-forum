import SearchField from "@/components/shared/search-field"
import iconTag from "@/icons/tag.svg"

const SearchTagField = ({ value, onChange }:{value: string, onChange: (value: string) => void}) => {
    return (
        <SearchField
            placeholder="Search by tags..."
            value={value}
            onChange={onChange}
            icon={iconTag}
        />
    )
}

export default SearchTagField