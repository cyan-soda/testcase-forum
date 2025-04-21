'use client'

import axios from 'axios'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import iconUpload from '@/icons/export.svg'
// import { useUserStore } from '@/store/user/user-store'
import { postService } from '@/service/post'
import { useTranslation } from 'react-i18next'

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
  input?: File | null
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
  const { t } = useTranslation('popup')
  const [isDuplicatePopupOpen, setIsDuplicatePopupOpen] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])
  // const [postData, setPostData] = useState<ICreatePostForm | null>(null)
  const [postId, setPostId] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [inputText, setInputText] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createPostSchema = Yup.object().shape({
    title: Yup.string().trim().required(t('popup_create.input.title.required')),
    description: Yup.string().trim().required(t('popup_create.input.description.required')),
    expected: Yup.string().trim().required(t('popup_create.input.expected.required')),
    code: Yup.string().trim().required(t('popup_create.input.code.required')),
    input: Yup.mixed<File>()
      .test('fileName', t('popup_create.input.support_file.test_name'), (value) => value && value.name === 'config.txt')
      .test('fileType', t('popup_create.input.support_file.test_type'), (value) => value && value.type === 'text/plain'),
  })

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePostForm>({
    resolver: yupResolver(createPostSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      expected: '',
      code: '',
      input: null,
    },
  })

  // Reset form when popup is closed
  useEffect(() => {
    if (!props.isOpen) {
      resetForm()
    }
  }, [props.isOpen])

  const resetForm = () => {
    reset()
    setFileName('')
    setInputText('')
    setSimilarPosts([])
    // setPostData(null)
    setPostId('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: ICreatePostForm) => {
    if (!data.input) return

    setIsSubmitting(true)
    try {
      const response = await postService.createPostForm(
        data.title,
        data.description,
        data.expected,
        data.code,
        data.input
      )

      const status = response.status
      const responseData: PostResponse = response.data

      if (status === 201) {
        resetForm()
        props.onClose()
        alert(t('alert.create_post_success'))
      } else if (status === 202) {
        setPostId(responseData.post.id)
        if (responseData.similar_posts && responseData.similar_posts.length > 0) {
          setSimilarPosts(responseData.similar_posts)
          // setPostData(data)
          setIsDuplicatePopupOpen(true)
        } else {
          console.warn('No similar posts provided in 202 response')
        }
      } else {
        console.error('Unexpected status code:', status)
        alert(t('alert.create_unexpected_error'))
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message, error.response?.status)
        alert(t('alert.create_post_fail') + ` ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert(t('alert.create_unexpected_error'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostAnyway = async () => {
    if (!postId) {
      alert(t('alert.no_post_id'))
      return
    }

    try {
      await postService.createPostAnyway(postId)
      resetForm()
      setIsDuplicatePopupOpen(false)
      props.onClose()
      alert(t('alert.create_post_success'))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message)
        alert(t('alert.create_post_fail') + ` ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert(t('alert.create_unexpected_error'))
      }
    }
  }

  const handleCancelPost = () => {
    // console.log('Post cancelled')
    setIsDuplicatePopupOpen(false)
    resetForm()
  }

  const Item = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [])

    return (
      <div className='flex flex-col gap-1 items-start w-full'>
        <span className='text-base font-semibold w-full'>{title}</span>
        <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                ref={textareaRef}
                className='rounded-lg bg-grey w-full text-base focus-within:outline-none auto-resize'
                rows={1}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e)
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${target.scrollHeight}px`
                }}
              />
            )}
          />
        </div>
        {error && <span className='text-red-500 text-sm'>{error}</span>}
      </div>
    )
  }

  const FileItem = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => {  
    return (
      <div className='flex flex-col gap-1 items-start w-full'>
        <span className='text-base font-semibold w-full'>{title}</span>
        <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange } }) => (
              <div className='flex flex-row gap-3 items-center'>
                <label className='cursor-pointer px-4 py-2 rounded-lg bg-white flex items-center gap-2'>
                  {t('popup_create.input.support_file.input_text')}
                  <input
                    type='file'
                    accept='.txt'
                    ref={fileInputRef}
                    className='hidden'
                    required={false}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null; // Explicitly allow null
                      onChange(file); // Pass null or file to react-hook-form
                      setFileName(file ? file.name : '');
                      // if (file) {
                      //   file.text().then((text) => setInputText(text));
                      // } else {
                      //   setInputText('');
                      // }
                    }}
                  />
                </label>
                {fileName && <span className='ml-3 text-sm'>{fileName}</span>}
              </div>
            )}
          />
        </div>
        {error && <span className='text-red-500 text-sm'>{error}</span>}
      </div>
    );
  };

  const ContentItem = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='flex flex-col gap-3 py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
              rows={3}
              value={typeof field.value === 'string' ? field.value : ''}
              onChange={(e) => {
                field.onChange(e)
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${target.scrollHeight}px`
              }}
            />
          )}
        />
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  const InputItem = () => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{t('popup_create.input.input.label')}</span>
      <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <textarea
          disabled
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
  )

  return (
    <>
      <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={t('popup_create.title')}>
        <form
          className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className='text-xl leading-8 font-semibold text-left w-full'>
            {t('popup_create.sub_1')}
          </span>
          <Item
            title={t('popup_create.input.title.label') + " *"}
            name='title'
            error={errors.title?.message}
          />
          <ContentItem
            title={t('popup_create.input.description.label') + " *"}
            name='description'
            error={errors.description?.message}
          />
          <ContentItem
            title={t('popup_create.input.code.label') + " *"}
            name='code'
            error={errors.code?.message}
          />

          <span className='text-xl leading-8 font-semibold text-left w-full'>{t('popup_create.sub_2')}</span>
          <div className='w-full space-y-4'>
            <InputItem />
            <FileItem
              title={t('popup_create.input.support_file.label')}
              name='input'
              error={errors.input?.message}
            />
          </div>
          <Item
            title={t('popup_create.input.expected.label') + " *"}
            name='expected'
            error={errors.expected?.message}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{isSubmitting ? t('popup_create.upload_button.loading') : t('popup_create.upload_button.label')}</span>
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