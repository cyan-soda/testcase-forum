import SearchField from "@/components/shared/search-field"
import iconTag from "@/icons/tag.svg"
import { useTranslation } from "react-i18next"

const SearchTagField = ({ value, onChange }:{value: string, onChange: (value: string) => void}) => {
    const { t } = useTranslation('home')
    return (
        <SearchField
            placeholder={t('utils.search_tag_placeholder') as string}
            value={value}
            onChange={onChange}
            icon={iconTag}
        />
    )
}

export default SearchTagField