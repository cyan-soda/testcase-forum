import Sidebar from "./sidebar"

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    // const pathname = usePathname()
    // const hideSidebar = pathname.startsWith('/auth/')
    return (
        <div className='relative z-0 flex flex-row w-full h-full gap-5'>
            <>
                <div className='w-1/6'>
                    <Sidebar />
                </div>
                <div className="w-5/6">
                    {children}
                </div>
            </>
        </div>
    )
};

export default LayoutContent