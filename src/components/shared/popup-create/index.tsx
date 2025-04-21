'use client'

import axios from 'axios'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'

import iconUpload from '@/icons/export.svg'
import { useUserStore } from '@/store/user/user-store'
import { postService } from '@/service/post'

const PopupWrapper = dynamic(() => import('@/components/shared/popup-wrapper'), { ssr: false })
const DuplicatePopup = dynamic(() => import('@/components/shared/popup-duplicate'), { ssr: false })

interface CreatePopupProps {
  isOpen: boolean
  onClose: () => void
}

interface ICreatePostForm {
  title: string
  description: string
  expected: string
  code: string
  input: File
}

interface SimilarPost {
  post_id: string
  title: string
  description: string
  author: string
  input: string
  expected: string
  similarity: number
}

interface PostResponse {
  post: {
    id: string
    mail: string
    subject: string
    title: string
    description: string
    last_modified: string
    testcase: {
      post_id: string
      input: string
      expected: string
      code: string
    }
    tags: string | null
  }
  similar_posts?: SimilarPost[]
}

const CreatePostPopup = (props: CreatePopupProps) => {
  const { user } = useUserStore()
  const [isDuplicatePopupOpen, setIsDuplicatePopupOpen] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])
  const [postData, setPostData] = useState<ICreatePostForm | null>(null)
  const [postId, setPostId] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [formData, setFormData] = useState<ICreatePostForm>({
    title: '',
    description: '',
    expected: '',
    code: '',
    input: null as unknown as File, 
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ICreatePostForm, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ICreatePostForm, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.expected.trim()) {
      newErrors.expected = 'Expected output is required'
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    }
    if (!formData.input) {
      newErrors.input = 'A config.txt file is required'
    } else if (formData.input.name !== 'config.txt') {
      newErrors.input = 'File must be named config.txt'
    } else if (formData.input.type !== 'text/plain') {
      newErrors.input = 'Only .txt files are allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<ICreatePostForm, 'input'>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : '')
    setFormData((prev) => ({ ...prev, input: file || null as unknown as File }))
    setErrors((prev) => ({ ...prev, input: undefined }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      expected: '',
      code: '',
      input: null as unknown as File,
    })
    setFileName('')
    setErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await postService.createPostForm(
        formData.title,
        formData.description,
        formData.expected,
        formData.code,
        formData.input
      )

      const status = response.status
      const responseData: PostResponse = response.data

      if (status === 201) {
        // No similar posts, post is uploaded
        resetForm()
        props.onClose()
        alert('Post created successfully!')
      } else if (status === 302) {
        // Similar posts found, open DuplicatePopup
        setPostId(responseData.post.id)
        if (responseData.similar_posts && responseData.similar_posts.length > 0) {
          setSimilarPosts(responseData.similar_posts)
          setPostData(formData)
          setIsDuplicatePopupOpen(true)
        } else {
          console.warn('No similar posts provided in 302 response')
        }
      } else {
        console.error('Unexpected status code:', status)
        alert('Unexpected error occurred. Please try again.')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message, error.response?.status)
        alert(`Failed to create post: ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostAnyway = async () => {
    if (!postId) {
      alert('No post ID available.')
      return
    }

    try {
      await postService.createPostAnyway(postId)
      resetForm()
      setIsDuplicatePopupOpen(false)
      props.onClose()
      alert('Post created successfully!')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message)
        alert(`Failed to post: ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred.')
      }
    }
  }

  const handleCancelPost = () => {
    console.log('Post cancelled')
    setIsDuplicatePopupOpen(false)
    setPostData(null)
    setSimilarPosts([])
    setPostId('')
    resetForm()
  }

  const Item = ({ title, value, onChange, error }: {
    title: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    error?: string
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <textarea
          value={value}
          onChange={onChange}
          className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = `${target.scrollHeight}px`
          }}
        />
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  const FileItem = ({
    title,
    error,
    onChange,
  }: {
    title: string
    error?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <label className='cursor-pointer px-4 py-2 rounded-lg bg-white flex items-center gap-2'>
          Choose File
          <input
            type='file'
            accept='.txt'
            ref={fileInputRef}
            className='hidden'
            onChange={onChange}
          />
        </label>
        {fileName && <span className='ml-3 text-sm'>{fileName}</span>}
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  const ContentItem = ({ title, value, onChange, error }: {
    title: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    error?: string
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='flex flex-col gap-3 py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <textarea
          value={value}
          onChange={onChange}
          className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
          rows={3}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = `${target.scrollHeight}px`
          }}
        />
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  return (
    <>
      <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title='Create a New Post'>
        <form
          className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'
          onSubmit={onSubmit}
        >
          <span className='text-xl leading-8 font-semibold text-left w-full'>
            Add some basic information about your post
          </span>
          <Item
            title='Title *'
            value={formData.title}
            onChange={(e) => handleInputChange(e, 'title')}
            error={errors.title}
          />
          <ContentItem
            title='Content *'
            value={formData.description}
            onChange={(e) => handleInputChange(e, 'description')}
            error={errors.description}
          />
          <ContentItem
            title='Test Code *'
            value={formData.code}
            onChange={(e) => handleInputChange(e, 'code')}
            error={errors.code}
          />

          <span className='text-xl leading-8 font-semibold text-left w-full'>Add your testcase</span>
          <div className='w-full space-y-4'>
            <div className='flex flex-col gap-1 items-start w-full'>
              <span className='text-base font-semibold w-full'>Input</span>
              <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
                <textarea
                  className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = `${target.scrollHeight}px`
                  }}
                />
              </div>
            </div>
            <FileItem
              title='Support File (config.txt) *'
              error={errors.input}
              onChange={handleFileChange}
            />
          </div>
          <Item
            title='Expected Output *'
            value={formData.expected}
            onChange={(e) => handleInputChange(e, 'expected')}
            error={errors.expected}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <span>{isSubmitting ? 'Uploading...' : 'Upload Post'}</span>
            <Image src={iconUpload} alt='' />
          </button>
        </form>
      </PopupWrapper>

      <DuplicatePopup
        isOpen={isDuplicatePopupOpen}
        onClose={handleCancelPost}
        similarPosts={similarPosts}
        onPostAnyway={handlePostAnyway}
      />
    </>
  )
}

export default CreatePostPopup