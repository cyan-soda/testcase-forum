import SearchField from "@/components/shared/search-field"
import iconSearch from "@/icons/search.svg"
import { useTranslation } from "react-i18next"

const SearchTextField = ({ 
    value, 
    onChange 
}: {
    value: string, 
    onChange: (val: string) => void 
}) => {
    const { t } = useTranslation('home')
    return (
        <SearchField
            placeholder={t('utils.search_text_placeholder')}
            value={value}
            onChange={(value: string) => onChange(value)} 
            icon={iconSearch}
        />
    )
}

export default SearchTextField
