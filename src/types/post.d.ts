export type TPost = {
    id: string,
    user_mail: string,
    author: string,
    subject: string,
    title: string,
    description: string,
    last_modified: string,
    testcase: {
        post_id: string,
        input: string,
        expected: string,
        code: string,
    },
    tags: string[],
    post_type: 0 | 1 | 2,
    interaction: {
        like_count: number,
        comment_count: number,
        like_id: string | null,
        verified_teacher_mail: string | null,
        view_count: number,
        run_count: number,
    }
}

export type TPostRelated = {
    post_id: string, 
    title: string,
    description: string,
    author: string,
    input: string,
    expected: string,
    similarity: number,
}