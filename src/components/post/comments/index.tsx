'use client';

import { useState } from 'react';
// import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// import iconSend from '@/icons/send.svg';
// import { LikeButton, CommentButton, BadgeButton } from '@/components/shared/buttons';
import { commentService } from '@/service/comment';
import { useUserStore } from '@/store/user/user-store';
import { TComment } from '@/types/comment';
import { useTranslation } from 'react-i18next';
// import CommentEditor from '../comment-editor';

// Validation schema for edit form
const commentSchema = yup
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

interface CommentProps {
    comment: TComment;
    onCommentUpdated?: () => void;
    onCommentReplied?: () => void;
}

const Comment = ({ comment, onCommentUpdated }: CommentProps) => {
    // const [isOpenBadge, setIsOpenBadge] = useState(false);
    // const [isOpenAnswer, setIsOpenAnswer] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const {t} = useTranslation('post')
    const { user } = useUserStore();
    // const { postId } = useParams<{ postId: string }>();

    // Form for editing
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors, isSubmitting: isSubmittingEdit },
    } = useForm<CommentFormData>({
        resolver: yupResolver(commentSchema),
        defaultValues: {
            content: comment.content,
        },
    });

    // const toggleReply = (parentId: number) => {
    //     if (parentId) {
    //         setOpenReplies((prev) => {
    //             const newState = new Set(prev);
    //             if (newState.has(parentId)) {
    //                 newState.delete(parentId);
    //             } else {
    //                 newState.add(parentId);
    //             }
    //             return newState;
    //         });
    //     }
    // };

    const handleEdit = async (data: CommentFormData) => {
        if (!user || !user.mail) {
            setError(t('post_details.comment_edit_Log_in'));
            return;
        }

        setError(null);
        try {
            await commentService.updateComment(
                comment.id,
                data.content
            );
            setIsEditing(false);
            resetEdit({ content: data.content });
            onCommentUpdated?.();
        } catch (err) {
            console.error(t('post_details.comment_edit_error'), err);
            setError(
                typeof err === 'string'
                    ? err
                    : err instanceof Error
                    ? err.message
                    : t('post_details.comment_edit_error')
            );
        }
    };

    const handleDelete = async () => {
        if (!user || !user.mail) {
            setError(t('post_details.comment_delete_Log_in'));
            return;
        }

        setError(null);
        try {
            await commentService.deleteComment(comment.id);
            onCommentUpdated?.();
        } catch (err) {
            console.error(t('post_details.comment_delete_error'), err);
            setError(
                typeof err === 'string'
                    ? err
                    : err instanceof Error
                    ? err.message
                    : t('post_details.comment_delete_error')
            );
        }
    }

    const canEdit = user && user.mail === comment.user_mail;
    const canDelete = user && user.mail === comment.user_mail;

    return (
        <div className="w-full flex flex-col gap-3 items-start">
            <div className='w-full h-[2px] bg-grey'></div>
            <div className="w-full flex flex-col gap-[10px] items-start">
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row gap-[10px] items-center justify-start">
                        <div className="rounded-full bg-grey h-10 w-10 text-black flex items-center justify-center">
                            {'N'}
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-base font-semibold flex-1">{comment.user_mail}</span>
                                <div className="bg-green rounded-full h-[6px] w-[6px]"></div>
                            </div>
                        </div>
                    </div>
                    <span className="text-sm font-normal">
                        <span className="font-semibold">{t('post_details.posted')}</span>
                        {new Date(comment.created_at).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}
                    </span>
                </div>
                {isEditing ? (
                    <form onSubmit={handleSubmitEdit(handleEdit)} className="w-full flex flex-row items-center gap-3">
                        <div className="w-full px-5 py-3 bg-grey text-black rounded-lg">
                            <textarea
                                className="bg-grey w-full text-sm font-normal focus-within:outline-none"
                                rows={3}
                                {...registerEdit('content')}
                            />
                            {editErrors.content && (
                                <p className="text-red-500 text-xs mt-1">{editErrors.content.message}</p>
                            )}
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                        <div className="flex flex-row items-center gap-2 mt-2">
                            <button
                                type="button"
                                className="bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black"
                                onClick={() => {
                                    setIsEditing(false);
                                    resetEdit({ content: comment.content });
                                    setError(null);
                                }}
                                disabled={isSubmittingEdit}
                            >
                                {t('post_details.comment_cancel')}
                            </button>
                            <button
                                type="submit"
                                className={`bg-green rounded-lg py-2 px-3 text-sm font-bold text-black ${isSubmittingEdit ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={isSubmittingEdit}
                            >
                                {isSubmittingEdit ? t('post_details.comment_saving') : t('post_details.comment_save')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full">
                        <span className="text-sm font-light text-justify">{comment.content}</span>
                    </div>
                )}
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center gap-3">
                        {/* <LikeButton like_count={comment.like_count} post_id={postId} /> */}
                        {/* <CommentButton count={comment.comment_count} onClick={() => comment.parent_id && toggleReply(comment.parent_id)} /> */}
                        {/* <BadgeButton count={comment.badge_count} isOpenBadge={isOpenBadge} setIsOpenBadge={() => setIsOpenBadge(!isOpenBadge)} /> */}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        {canEdit && !isEditing && (
                            <button
                                className="bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black"
                                onClick={() => setIsEditing(true)}
                            >
                                {t('post_details.comment_edit')}
                            </button>
                        )}
                        {canDelete && (
                            <button
                                className="bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black"
                                onClick={handleDelete}
                            >
                                {t('post_details.comment_delete')}
                            </button>
                        )}
                        {/* <button
                            className="bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black flex flex-row items-center gap-2"
                            onClick={() => setIsOpenAnswer(!isOpenAnswer)}
                        >
                            <Image src={iconSend} alt="" width={24} height={24} />
                            Reply
                        </button> */}
                    </div>
                </div>
            </div>
            {/* {isOpenAnswer && user && (
                <CommentEditor
                    postId={postId}
                    parentId={comment.id}
                    onCommentCreated={() => {
                        setIsOpenAnswer(false)
                        onCommentReplied?.()
                    }}
                    placeholder="Type here to reply..."
                />
            )} */}
        </div>
    );
};

export default Comment;