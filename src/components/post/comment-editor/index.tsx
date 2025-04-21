'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { commentService } from '@/service/comment'; 
import { useTranslation } from 'react-i18next';

// Validation schema
const schema = yup
    .object({
        content: yup
            .string()
            .required('Comment cannot be empty')
            .min(1, 'Comment must be at least 1 character')
            .max(500, 'Comment cannot exceed 500 characters'),
    })
    .required();

interface CommentFormData {
    content: string;
}

interface CommentEditorProps {
    postId: string;
    //   userMail: string;
    parentId?: string; // Optional for replies
    onCommentCreated?: () => void; // Callback for parent component
    placeholder?: string; // Customizable placeholder
}

const CommentEditor = ({
    postId,
    //   userMail,
    // parentId,
    onCommentCreated,
    placeholder,
}: CommentEditorProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {t} = useTranslation('post')

    const {
        register,
        handleSubmit,
        // reset,
        formState: { errors },
    } = useForm<CommentFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            content: '',
        },
    });

    const onSubmit = async (data: CommentFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await commentService.createComment(postId, data.content)
        } catch (err) {
            console.error('Error creating comment:', err);
            setError((err as string) || t('post_details.comment_create_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-row items-center justify-between gap-3"
        >
            <div className="w-full px-5 py-3 bg-grey text-black rounded-lg">
                <textarea
                    className="bg-grey w-full text-sm font-normal focus-within:outline-none"
                    placeholder={placeholder}
                    rows={3}
                    {...register('content')}
                />
                {errors.content && (
                    <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                )}
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div className="flex flex-row items-center gap-2">
                {/* <button
                    type="button"
                    className="bg-grey rounded-lg py-3 px-4 text-sm font-bold text-black"
                    onClick={() => reset()}
                    disabled={isSubmitting}
                >
                    Cancel
                </button> */}
                <button
                    type="submit"
                    className={`bg-green rounded-lg py-3 px-4 text-sm font-bold text-black ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('post_details.submitting') : t('post_details.submit_comment')}
                </button>
            </div>
        </form>
    );
};

export default CommentEditor;