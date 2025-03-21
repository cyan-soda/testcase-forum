import SearchField from "@/components/shared/search-field"
import iconFilter from "@/icons/filter.svg"
import { useTranslation } from "react-i18next"

const SearchFilterField = ({ value, onChange }:{value: string, onChange: (value: string) => void}) => {
    const { t } = useTranslation('home')
    return (
        <SearchField
            placeholder={t('utils.filter_placeholder') as string}
            value={value}
            onChange={onChange}
            icon={iconFilter}
        />
    )
}

export default SearchFilterField