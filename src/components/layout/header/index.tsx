'use client'

import { NAV_ITEMS } from "@/constants/header.constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import dynamic from "next/dynamic"
import iconDownArrow from '@/icons/down-arrow.svg'
import iconGlobe from '@/icons/globe.svg'
const CreatePostPopup = dynamic(() => import('@/components/shared/popup-create'), { ssr: false })
import { useTranslation } from "react-i18next"
import { changeLanguage } from "i18next"
import { useLanguage } from "@/utils/local-storage"
import DuplicatePopup from "@/components/shared/popup-duplicate"
import { useUserStore } from "@/store/user/user-store"
import { useAuthStore } from "@/store/auth/auth-store"

const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const Header = () => {
    const router = useRouter()
    const [activeLink, setActiveLink] = useState('')
    const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false)
    const languages = [{ name: 'en', abbr: 'ENG' }, { name: 'vi', abbr: 'VIE' }]
    const [lang, setLang] = useState('VIE')
    const { t } = useTranslation('header')

    const { user } = useUserStore()
    const { isAuthenticated, logOut } = useAuthStore()

    useEffect(() => {
        const savedLink = localStorage.getItem('activeLink')
        if (savedLink) setActiveLink(savedLink)
    }, [])

    const handleClick = (link: string) => {
        setActiveLink(link)
        localStorage.setItem('activeLink', link)
        // if (link === '/archive') {
        //     router.push(`/archive/${user?.id}`)
        //     return
        // }
        router.push(link)
    }

    const handleCreatePost = () => {
        if (user && isAuthenticated)
            setIsOpenCreatePopup(true)
    }

    const { setLanguage } = useLanguage()
    const handleChangeLanguage = (lang: string, abbr: string) => {
        changeLanguage(lang)
        setLanguage(lang)
        setLang(abbr)
    }

    return (
        <>
            <div className="max-w-screen sticky inset-0 z-10 bg-white px-6 py-5 shadow-[0_1px_2px_0px_rgba(0,0,0,0.1)] rounded-b-lg border-b-[3px] border-b-[#191A23]">
                <div className="relative mx-auto flex w-full max-w-[1440px] flex-row items-center justify-start">
                    <div className="sticky left-0 flex flex-row gap-4 cursor-pointer justify-start items-center" onClick={() => { router.push('/') }}>
                        <div className="bg-green w-[22px] h-[22px] rounded-md"></div>
                        <div className="flex flex-col items-start justify-start text-lg leading-tight font-bold">
                            <span>Testcase</span>
                            <span>Forum</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[10px] ml-24 justify-start flex-grow">
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
                            <div className="">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex flex-row gap-3 items-center focus:border-none">
                                        <div className="bg-green rounded-md p-2">
                                            <p className="text-base font-semibold">{isAuthenticated && user ? getInitials(user.first_name, user.last_name) : "?"}</p>
                                        </div>
                                        <p className="text-base font-normal">{isAuthenticated && user ? `${user.first_name} ${user.last_name}` : t('guest_placeholder')}</p>
                                        <Image src={iconDownArrow} alt="" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div>
                                            {user && isAuthenticated ? (
                                                <>
                                                    <DropdownMenuItem onClick={() => { router.push('/profile') }} className="hover:cursor-pointer">
                                                        {t('account_options.profile')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => { logOut(); router.push('/') }} className="hover:cursor-pointer">
                                                        {t('account_options.logout')}
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <DropdownMenuItem onClick={() => { router.push('/auth/log-in') }} className="hover:cursor-pointer">
                                                        {t('account_options.login')}
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="-ml-4 flex flex-row items-center gap-[10px] rounded-md bg-white hover:bg-grey transition-all duration-300 cursor-pointer p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex flex-row gap-[10px] items-center focus:border-none">
                                    <Image src={iconGlobe} alt="" width={16} height={16} />
                                    <span>{lang}</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="">
                                    <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {languages.map((language, index) => (
                                        <DropdownMenuItem key={index} onClick={() => handleChangeLanguage(language.name, language.abbr)} className="hover:cursor-pointer">
                                            {t(`language_options.${language.name as "en" | "vi"}`)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
            <CreatePostPopup isOpen={isOpenCreatePopup} onClose={() => { setIsOpenCreatePopup(false); console.log(isOpenCreatePopup) }} />

        </>
    )
}

export default Header