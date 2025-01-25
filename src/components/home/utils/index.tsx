import SearchFilterField from "./search-filter"
import SearchTagField from "./search-tag"
import SearchTextField from "./search-text"

const UtilSection = () => {
    return (
        <div className="w-full flex flex-col gap-3 p-5 rounded-2xl border border-black">
            <SearchTextField value="" onChange={(value) => console.log(value)} />
            <div className="flex flex-row gap-3">
                <div className="w-2/3">
                    <SearchTagField value="" onChange={(value) => console.log(value)} />
                </div>
                <div className="w-1/3">
                    <SearchFilterField value="" onChange={(value) => console.log(value)} />
                </div>
            </div>
        </div>
    )
}

export default UtilSection