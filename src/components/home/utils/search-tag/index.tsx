import DropdownSearchField from '@/components/shared/dropdown-search'
import iconTag from "@/icons/tag.svg";
import { useTranslation } from "react-i18next";

const SearchTagField = ({
    value,
    onChange,
    availableTags
}: {
    value: string[];
    onChange: (value: string[]) => void;
    availableTags: string[];
}) => {
    const { t } = useTranslation("home");

    return (
        <DropdownSearchField
            items={availableTags}
            value={value}
            onChange={onChange}
            icon={iconTag}
            placeholder={t("utils.search_tag_placeholder")}
        />
    );
};

export default SearchTagField;
