import { useUserStore } from "@/store/user/user-store"

const MyLikedPosts = () => {
    const { user } = useUserStore()

    return (
        <div>
            {!user && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-2xl font-bold">Please login to see your liked posts</h1>
                </div>
            )}
            My Liked Posts
        </div>
    )
}

export default MyLikedPosts