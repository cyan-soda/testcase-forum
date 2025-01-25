'use client'

import { NAV_ITEMS } from "@/constants/header.constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

import iconDownArrow from '@/icons/down-arrow.svg'
import CreatePostPopup from "@/components/shared/popup-create"

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
                                {item.title}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-row gap-8 items-center flex-end">
                        <button
                            className={`p-4 rounded-md text-black bg-green hover:bg-grey text-sm font-semibold transition-all duration-300`}
                            onClick={() => { handleCreatePost() }}
                        >
                            Create Post
                        </button>
                        <div className="flex flex-row p-[10px] gap-8 items-center justify-center rounded-md bg-white hover:bg-grey transition-all duration-300 cursor-pointer">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="bg-green rounded-md p-2">
                                    <p className="text-base font-semibold">{getInitials(USER_INFO.name)}</p>
                                </div>
                                <p className="text-base font-normal">{USER_INFO.name}</p>
                            </div>
                            <Image src={iconDownArrow} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <CreatePostPopup isOpen={isOpenCreatePopup} onClose={() => setIsOpenCreatePopup(false)} />
        </>
    )
}

export default Header