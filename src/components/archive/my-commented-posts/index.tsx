import { useUserStore } from "@/store/user/user-store"


const MyCommentedPosts = () => {
    const { user } = useUserStore()
    return (
        <div>
            {!user && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-2xl font-bold">Please login to see your commented posts</h1>
                </div>
            )}
            My Commented Posts
        </div>
    )
}

export default MyCommentedPosts