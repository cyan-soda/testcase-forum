'use client'

import { NAV_ITEMS } from "@/constants/header.constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

import iconDownArrow from '@/icons/down-arrow.svg'
import iconGlobe from '@/icons/globe.svg'
import CreatePostPopup from "@/components/shared/popup-create"
import { useTranslation } from "react-i18next"
import { changeLanguage } from "i18next"
import { setLanguage } from "@/utils/local-storage"
import DuplicatePopup from "@/components/shared/popup-duplicate"

const USER_INFO = {
    name: 'Naomi Nguyen',
}

const getInitials = (name: string) => {
    const names = name.split(' ')
    return names.map((n) => n[0]).join('')
}

const Header = () => {
    const router = useRouter()
    const [activeLink, setActiveLink] = useState('')
    const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false)
    const languages = [{ name: 'en', abbr: 'ENG' }, { name: 'vi', abbr: 'VIE' }]
    const [lang, setLang] = useState('VIE')
    const { t } = useTranslation('header')

    useEffect(() => {
        const savedLink = localStorage.getItem('activeLink')
        if (savedLink) setActiveLink(savedLink)
    }, [])

    const handleClick = (link: string) => {
        setActiveLink(link)
        localStorage.setItem('activeLink', link)
        router.push(link)
    }

    const handleCreatePost = () => {
        setIsOpenCreatePopup(true)
    }

    const handleChangeLanguage = (lang: string, abbr: string) => {
        changeLanguage(lang)
        setLanguage(lang)
        setLang(abbr)
    }

    return (
        <>
            <div className="max-w-screen sticky inset-0 z-10 bg-white px-6 py-5 shadow-[0_1px_2px_0px_rgba(0,0,0,0.1)] rounded-b-lg border-b-[3px] border-b-[#191A23]">
                <div className="relative mx-auto flex w-full max-w-[1440px] flex-row items-center justify-start">
                    <div className="sticky left-0 flex flex-row gap-[10px] cursor-pointer justify-start items-center">
                        <div className="bg-green w-[22px] h-[22px] rounded-md"></div>
                        <span className="text-xl font-bold">tc.forum</span>
                    </div>
                    <div className="flex flex-row gap-[10px] ml-10 justify-start flex-grow">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`flex items-center justify-center px-8 py-[10px] rounded-lg text-lg leading-6 font-semibold ${activeLink === item.link ? 'text-white bg-black' : 'text-black bg-white'
                                    } hover:bg-grey hover:text-black hover:transition-all hover:duration-300 focus:outline-none`}
                                onClick={() => handleClick(item.link)}
                            >
                                {t(`tabs.${item.title as "home" | "archive" | "ranking" | "calendar"}`)}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-row gap-8 items-center flex-end">
                        <button
                            className={`p-4 rounded-md text-black bg-green hover:bg-grey text-base font-semibold transition-all duration-300`}
                            onClick={() => { handleCreatePost() }}
                        >
                            {t('create_button')}
                        </button>
                        <div className="flex flex-row px-[10px] py-2 gap-8 items-center justify-center rounded-md bg-white hover:bg-grey transition-all duration-300 cursor-pointer">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="bg-green rounded-md p-2">
                                    <p className="text-base font-semibold">{getInitials(USER_INFO.name)}</p>
                                </div>
                                <p className="text-base font-normal">{USER_INFO.name}</p>
                            </div>
                            <Image src={iconDownArrow} alt="" />
                        </div>
                        <div className="-ml-4 flex flex-row items-center gap-[10px] rounded-md bg-white hover:bg-grey transition-all duration-300 cursor-pointer p-4">
                            <Image src={iconGlobe} alt="" width={16} height={16} />
                            <DropdownMenu>
                                <DropdownMenuTrigger>{lang}</DropdownMenuTrigger>
                                <DropdownMenuContent className="">
                                    <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {languages.map((language, index) => (
                                        <DropdownMenuItem key={index} onClick={() => handleChangeLanguage(language.name, language.abbr)} >
                                            {t(`language_options.${language.name as "en" | "vi"}`)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
            <CreatePostPopup isOpen={isOpenCreatePopup} onClose={() => {setIsOpenCreatePopup(false); console.log(isOpenCreatePopup)}} />
        </>
    )
}

export default Header