'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

import iconHouse from '@/icons/house.svg'

const SIDEBAR_ITEMS = [
    {
        id: 0,
        title: 'My Spaces',
        course_titles: [
            {
                id: 0,
                title: "Introduction to Programming",
                term: "242",
                code: "CO1005",
            },
            {
                id: 1,
                title: "Discrete Mathematics",
                term: "242",
                code: "CO1007",
            },
            {
                id: 2,
                title: "Data Structures and Algorithms",
                term: "242",
                code: "CO2003",
            },
            {
                id: 3,
                title: "Principal of Programming Languages",
                term: "242",
                code: "CO3005",
            }
        ],
    },
    {
        id: 1,
        title: 'All Spaces',
        course_titles: [
            {
                id: 0,
                title: "Introduction to Programming",
                term: "242",
                code: "CO1005",
            },
            {
                id: 1,
                title: "Discrete Mathematics",
                term: "242",
                code: "CO1007",
            },
            {
                id: 2,
                title: "Data Structures and Algorithms",
                term: "242",
                code: "CO2003",
            },
            {
                id: 3,
                title: "Principal of Programming Languages",
                term: "242",
                code: "CO3005",
            }
        ],
    },
]

type SidebarGroupProps = {
    id: number;
    title: string;
    courses: { id: number; title: string; term: string; code: string; }[];
}

const SidebarGroup = ({id, title, courses} : SidebarGroupProps) => {
    const router = useRouter()
    const { code, term } = useParams()

    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        if (code && term) setActiveTab(code + '-' + term)
    }, [code, term])

    const handleClickTab = (code: string, term: string, spaceId: number) => {
        spaceId === 0 
        ? router.push(`/my-spaces/${code}/${term}`) 
        : router.push(`/all-spaces/${code}/${term}`)
        setActiveTab(code + '-' + term)
    }

    return (
        <div className="w-full flex flex-col py-8 gap-8 items-start justify-start border-b-2 border-b-grey">
            <div className="flex flex-row items-center justify-start gap-2 px-5">
                <Image src={iconHouse} height={24} width={24} alt="home-icon" />
                <p className="text-lg font-bold">{title}</p>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start">
                {courses.map((course) => (
                    <button
                        key={course.id} 
                        className={`w-full px-5 py-4 text-base font-medium text-black 
                        hover:bg-grey hover:rounded-r-xl hover:transition-all hover:duration-300
                        ${activeTab === course.code + '-' + course.term ? 'bg-green border-l-[3px] border-black' : ''}`}
                        onClick={() => {handleClickTab(course.code, course.term, id)}}
                    >
                        <p className="text-left">[{course.term}] - {course.title}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

const Sidebar = () => {
    return (
        <div className="h-full bg-white border-r-2 border-grey">
            <div className="flex flex-col items-start justify-start">
                {SIDEBAR_ITEMS.map((item) => (
                    <SidebarGroup key={item.id} id={item.id} title={item.title} courses={item.course_titles} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar