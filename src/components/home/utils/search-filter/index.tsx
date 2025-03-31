import DropdownSearchField from "@/components/shared/dropdown-search";
import iconFilter from "@/icons/filter.svg";
import { useTranslation } from "react-i18next";

const SearchFilterField = ({
    value,
    onChange,
    availableOptions,
}: {
    value: string;
    onChange: (value: string) => void;
    availableOptions: string[];
}) => {
    const { t } = useTranslation("home");

    return (
        <DropdownSearchField
            placeholder={t("utils.filter_placeholder") as string}
            items={availableOptions}
            value={[value]}
            onChange={(selected: string[]) => onChange(selected[selected.length - 1])} 
            icon={iconFilter}
        />
    );
};

export default SearchFilterField;
