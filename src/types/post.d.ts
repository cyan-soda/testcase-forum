export type TPost = {
    id: string,
    title: string,
    description: string,
    testcase: {
        input: string,
        expected_output: string
    },
    user_id?: string,
    created_at?: string,
    updated_at?: string,
    user?: {
        id: string,
        mail: string,
        first_name: string,
        last_name: string,
        avatar: string,
        maso: string,
        role: string
    }
}