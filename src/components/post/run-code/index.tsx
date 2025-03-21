'use client'

import Image from "next/image"
import { useState } from "react"

import iconRightArrow from '@/icons/arrow--right.svg'
import iconPlay from '@/icons/video-square.svg'

type TestCaseProps = {
    input: string
    expected: string
    total: number
    pass: number
}

type ExecutionProps = {
    isPassed: boolean
}

const Field = ({ label, value }: { label: string, value?: string }) => {
    return (
        <div className="flex flex-col items-start gap-2 w-full">
            <span className="font-normal text-xs">{label}</span>
            <div className="rounded-lg bg-grey px-[10px] py-3 text-sm font-semibold w-full">{value}</div>
        </div>
    )
}

const RecPostItem = ({ title, author, link }: { title: string, author: string, link: string }) => {
    return (
        <div className="flex flex-row items-start gap-4 w-full cursor-pointer hover:bg-grey p-3 rounded-lg">
            <div className="flex flex-col items-start gap-[6px]">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs font-normal">{author}</span>
            </div>
            <Image src={iconRightArrow} alt="" width={20} height={20} />
        </div>
    )
}

const CaseItems = [
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Son Nguyen", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Son Nguyen", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
]

const RunCode = ({ testcase, execution }: { testcase?: TestCaseProps, execution?: ExecutionProps }) => {
    const [fileName, setFileName] = useState('')
    const handleUploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => { 
        // handle upload files
        if (event && event.target && event.target.files) {
            const file = event.target.files[0]
            if (file) {
                setFileName(file.name)
            }
        }
    }

    return (
        <div className="min-h-screen w-full bg-white text-black p-5 rounded-xl">
            <span className="font-semibold text-2xl">Try it out!</span>
            <div className="flex flex-row items-center gap-3 w-full mb-6 mt-3 text-base font-bold">
                <button
                    className={`flex flex-row gap-2 px-4 py-3 rounded-lg bg-green`}
                    onClick={() => { }}
                >
                    Run Code
                    <Image src={iconPlay} alt="" width={20} height={20} />
                </button>
                <label className="cursor-pointer px-4 py-3 rounded-lg bg-grey flex items-center gap-2">
                    Upload Files
                    <input
                        type="file"
                        className="hidden" 
                        onChange={handleUploadFiles}
                    />
                </label>
                <div className="flex-1 w-full flex flex-row items-center border rounded-lg border-dashed h-full p-3">
                    {fileName 
                        ? <span className="text-sm font-normal w-full text-center">{fileName}</span> 
                        : <span className="text-sm font-normal w-full text-grey text-center">Drag and drop your file here...</span>
                    }
                </div>
            </div>
            <div className="flex flex-row items-start gap-5">
                <div className="flex flex-col gap-5 items-start w-3/5">
                    {/* test results */}
                    <div className="flex flex-col p-4 items-start rounded-lg border border-black w-full">
                        <span className="text-xl font-semibold">Test Results</span>
                        <div className="mt-3 flex flex-row gap-3 items-center">
                            <div className={`${execution?.isPassed ? 'bg-green' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Passed</div>
                            <div className={`${!execution?.isPassed ? 'bg-green' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Failed</div>
                        </div>
                        <div className="mt-5 flex flex-col gap-2 items-start w-full">
                            <Field label="Input" value={"1234567"} />
                            <Field label="Expected Output" value={"True"} />
                            <Field label="Output" value={"False"} />
                        </div>
                    </div>
                    {/* overview, graphs */}
                    <div className="flex flex-col p-4 items-start rounded-lg border border-black w-full">
                        <span className="text-xl font-semibold">Overview</span>
                        <div className="w-full flex flex-row items-center justify-between">
                            <div className="mt-3 flex flex-row gap-3 items-center">
                                <div className={`${execution?.isPassed ? 'bg-green' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Passed</div>
                                <div className={`${!execution?.isPassed ? 'bg-green' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Failed</div>
                            </div>
                            <div className="flex flex-row items-center gap-3 text-xs">
                                <span className="font-semibold pr-3 border-r border-black">Total: <span className="font-normal">{"1234"}</span></span>
                                <span className="font-semibold pr-3 border-r border-black">Passed: <span className="font-normal">{"123"}</span></span>
                                <span className="font-semibold">Pass Rate: <span className="font-normal">{"9.96"}%</span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-black py-5 px-3 w-2/5">
                    <span className="text-xl font-semibold p-3">Recommended Posts</span>
                    <div className="flex flex-col gap-1 mt-3">
                        {CaseItems.map((item, index) => (
                            <RecPostItem key={index} title={item.title} author={item.author} link={item.link} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RunCode