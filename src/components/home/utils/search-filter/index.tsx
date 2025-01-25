import SearchField from "@/components/shared/search-field"
import iconFilter from "@/icons/filter.svg"

const SearchFilterField = ({ value, onChange }:{value: string, onChange: (value: string) => void}) => {
    return (
        <SearchField
            placeholder="Filter by..."
            value={value}
            onChange={onChange}
            icon={iconFilter}
        />
    )
}

export default SearchFilterField