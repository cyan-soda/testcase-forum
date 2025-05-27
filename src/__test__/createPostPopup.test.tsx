import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreatePostPopup from '@/components/shared/popup-create'
import { postService } from '@/service/post'
import '@testing-library/jest-dom'
import React, {ReactNode} from 'react'

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock service
jest.mock('@/service/post', () => ({
  postService: {
    createPostForm: jest.fn(),
    createPostAnyway: jest.fn(),
  },
}))

jest.mock('next/dynamic', () => (handler: () => React.ComponentType) => handler())  // This mocks dynamic import

jest.mock('@/components/shared/popup-wrapper', () => ({
  PopupWrapper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/shared/popup-duplicate', () => ({
  DuplicatePopup: ({ isOpen, onClose, similarPosts, onPostAnyway }: { isOpen: boolean; onClose: () => void; similarPosts: { post_id: string; title: string }[]; onPostAnyway: () => void }) => (
    <div>
      {isOpen && (
        <div>
          <h1>Duplicate Popup</h1>
          {similarPosts.map((post) => (
            <div key={post.post_id}>{post.title}</div>
          ))}
          <button onClick={onClose}>Close</button>
          <button onClick={onPostAnyway}>Continue</button>
        </div>
      )}
    </div>
  ),
}));

// Utility to render popup
const renderComponent = (isOpen = true) => {
  const onClose = jest.fn()
  const utils = render(<CreatePostPopup isOpen={isOpen} onClose={onClose} />)
  return { ...utils, onClose }
}

describe('CreatePostPopup', () => {
  test('1.1 Hiển thị popup khi mở', () => {
    renderComponent()
    expect(screen.getByText('popup_create.title')).toBeInTheDocument()
    expect(screen.getByText('popup_create.sub_1')).toBeInTheDocument()
  })

  test('1.2 Hiển thị lỗi khi gửi form thiếu thông tin', async () => {
    renderComponent()

    fireEvent.click(screen.getByText('popup_create.upload_button.label'))

    await waitFor(() => {
      expect(screen.getByText('popup_create.input.title.required')).toBeInTheDocument()
      expect(screen.getByText('popup_create.input.description.required')).toBeInTheDocument()
      expect(screen.getByText('popup_create.input.expected.required')).toBeInTheDocument()
      expect(screen.getByText('popup_create.input.code.required')).toBeInTheDocument()
    })
  })

  test('1.3 Tạo bài viết thành công khi nhập đủ dữ liệu', async () => {
    (postService.createPostForm as jest.Mock).mockResolvedValue({
      status: 201,
      data: { post: {} },
    })

    renderComponent()

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } })
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'print("Hello")' } })
    fireEvent.change(screen.getByLabelText(/expected/i), { target: { value: 'Hello' } })

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText(/popup_create.input.support_file.input_text/i)
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByText('popup_create.upload_button.label'))

    await waitFor(() => {
      expect(postService.createPostForm).toHaveBeenCalled()
    })
  })

  test('1.4 Hiển thị popup bài viết trùng lặp nếu có bài tương tự', async () => {
    (postService.createPostForm as jest.Mock).mockResolvedValue({
      status: 202,
      data: {
        post: { id: '123' },
        similar_posts: [
          {
            post_id: '1',
            title: 'Bài giống',
            description: 'desc',
            author: 'Nguyen Van A',
            input: 'input data',
            expected: 'expected data',
            similarity: 0.95,
          },
        ],
      },
    })

    renderComponent()

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } })
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'print("Hello")' } })
    fireEvent.change(screen.getByLabelText(/expected/i), { target: { value: 'Hello' } })

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText(/popup_create.input.support_file.input_text/i)
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByText('popup_create.upload_button.label'))

    await waitFor(() => {
      expect(screen.getByText('popup_create.title')).toBeInTheDocument()
    })
  })
})
