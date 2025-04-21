'use-client'

import { create } from 'zustand'
import { TPost } from '@/types/post'
import { persist } from 'zustand/middleware'

type PostState = {
    posts: TPost[]
    addPost: (post: TPost) => void
    updatePost: (id: string, post: Partial<TPost>) => void
    removePost: (id: string) => void
    setPosts: (posts: TPost[]) => void
    clearPosts: () => void
    getPostById: (id: string) => TPost | undefined
    setPostById: (id: string, post: Partial<TPost>) => void
}

export const usePostStore = create<PostState>()(
    persist(
        (set, get) => ({
            posts: [],
            addPost: (post: TPost) =>
                set((state) => ({
                    posts: [...state.posts, post],
                })),
            updatePost: (id: string, updatedPost: Partial<TPost>) =>
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === id ? { ...post, ...updatedPost } : post
                    ),
                })),
            removePost: (id: string) =>
                set((state) => ({
                    posts: state.posts.filter((post) => post.id !== id),
                })),
            setPosts: (posts: TPost[]) =>
                set({ posts }),
            clearPosts: () =>
                set({ posts: [] }),
            getPostById: (id: string) =>
                get().posts.find((post) => post.id === id),
            setPostById: (id: string, updatedPost: Partial<TPost>) =>
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === id ? { ...post, ...updatedPost } : post
                    ),
                })),
        }),
        {
            name: 'post-storage', // Unique storage key
            // storage: createJSONStorage(() => sessionStorage), // Uncomment to use sessionStorage
            // storage: createJSONStorage(() => localStorage), // Uncomment to use localStorage
        }
    )
)