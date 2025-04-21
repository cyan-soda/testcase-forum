// import Image from "next/image"
// import { useTranslation } from "react-i18next"
// import iconRightArrowBold from '@/icons/right-arrow-bold.svg'

// const TAGS = [
//     {   
//         id: 0,
//         tag: 'dsa',
//         count: 12804
//     },
//     {
//         id: 1,
//         tag: 'programming',
//         count: 214
//     },
//     {
//         id: 2,
//         tag: 'graph',
//         count: 1314
//     },
// ]

// const Item = ({ tag, count }: { tag: string, count: number }) => {
//     const { t } = useTranslation('home')
//     return (
//         <div className={`flex flex-row items-center gap-[10px] rounded-xl p-3 text-black hover:bg-grey hover:cursor-pointer`}>
//             <div className="rounded-md bg-black h-8 w-8"></div>
//             <div className="flex flex-col items-start gap-1">
//                 <span className="text-xs leading-[18px] font-semibold hover:underline">#{tag}</span>
//                 <span className="text-[10px] leading-4 font-normal">{count} {t('tags_section.content')}</span>
//             </div>
//         </div>
//     )
// }

// const PopularTags = () => {
//     const { t } = useTranslation('home')
//     return (
//         <div className="flex flex-col gap-5 p-2 bg-white rounded-2xl border border-black">
//             <button className="flex flex-row gap-2 items-center p-3 pb-0">
//                 <span className="text-base font-semibold hover:underline">{t('tags_section.title')}</span>
//                 <Image src={iconRightArrowBold} alt="" />
//             </button>
//             <div className="flex flex-col gap-2">
//                 {TAGS.map((post) => (
//                     <Item key={post.id} tag={post.tag} count={post.count} />
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default PopularTags