export type TComment = {
    id: string,
    user_mail: string,
    post_id: string,
    content: string,
    parent_id: string | null,
    created_at: string,
}