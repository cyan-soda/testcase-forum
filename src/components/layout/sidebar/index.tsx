// Sidebar.tsx
'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import iconHouse from '@/icons/house.svg';
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const SIDEBAR_ITEMS = [
    {
        id: 0,
        title: 'my_spaces',
        course_titles: [
            { id: 0, title: "Introduction to Programming", term: "242", code: "CO1005" },
            // { id: 1, title: "Discrete Mathematics", term: "242", code: "CO1007" },
            // { id: 2, title: "Data Structures and Algorithms", term: "242", code: "CO2003" },
            // { id: 3, title: "Principal of Programming Languages", term: "242", code: "CO3005" }
        ],
    },
    // {
    //     id: 1,
    //     title: 'all_spaces',
    //     course_titles: [
    //         { id: 0, title: "Introduction to Programming", term: "242", code: "CO1005" },
    //         { id: 1, title: "Discrete Mathematics", term: "242", code: "CO1007" },
    //         { id: 2, title: "Data Structures and Algorithms", term: "242", code: "CO2003" },
    //         { id: 3, title: "Principal of Programming Languages", term: "242", code: "CO3005" }
    //     ],
    // },
]

type SidebarGroupProps = {
    id: number;
    title: string;
    courses: { id: number; title: string; term: string; code: string }[];
}

const SidebarGroup = ({ id, title, courses }: SidebarGroupProps) => {
    const router = useRouter()
    const { course, term } = useParams()
    const [activeTab, setActiveTab] = useState<string>("")

    useEffect(() => {
        // const id = searchParams.get("id");
        // const course = searchParams.get("course");
        // const term = searchParams.get("term");
        if (course && term) {
            setActiveTab(`${course}-${term}`);
            console.log(`${course}-${term}`);
        }
    }, [course, term]);

    const handleClickTab = (courseCode: string, courseTerm: string, spaceId?: number) => {
        // const space = spaceId === 0 ? "my-spaces" : "all-spaces";
        router.push(`/space/${courseCode}/${courseTerm}`);
    };

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
                        ${activeTab === course.code + "-" + course.term ? "bg-green rounded-r-xl border-l-[3px] border-black" : ""}`}
                        onClick={() => handleClickTab(course.code, course.term, id)}
                    >
                        <p className="text-left">[{course.term}] - {course.title}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Sidebar = () => {
    const { t } = useTranslation('sidebar')

    return (
        <div className="h-full bg-white border-r-2 border-grey">
            <div className="flex flex-col items-start justify-start">
                {SIDEBAR_ITEMS.map((item) => (
                    <SidebarGroup 
                        key={item.id} 
                        id={item.id} 
                        title={t(item.title as "my_spaces" | "all_spaces")} 
                        courses={item.course_titles} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
