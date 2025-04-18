'use client'

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthStore } from "@/store/auth/auth-store"
import { authService } from "@/service/auth"
import { useUserStore } from "@/store/user/user-store"
import { useTranslation } from "react-i18next"

interface ILoginForm {
    email: string,
    password: string,
    remember: boolean
}

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .matches(/^(?! )[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address')
        .required('Email is required'),
    password: yup
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
        .matches(/^(?=.*[A-Z])/, 'Password must include at least one uppercase letter')
        .matches(/^(?=.*[0-9])/, 'Password must include at least one digit')
        .matches(/^(?=.*[@$!%?&#^()])/, 'Password must include at least one special character'),
    remember: yup
        .boolean()
        .default(false)
})

const LoginForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { logIn } = useAuthStore()
    const { setUser } = useUserStore()
    const { t } = useTranslation('login')

    useEffect(() => {
        const fetchGoogleLogin = async () => {
            const code = searchParams.get("code")
            if (code) {
                try {
                    const res = await authService.loginGoogle(code)
                    // console.log("Google Login Success:", res)
                    if (res.token) {
                        logIn(res.token, res.user)
                        setUser(res.user)
                        router.push("/")
                    }
                } catch (error) {
                    console.error("Error exchanging code for token:", error)
                }
            }
        };

        fetchGoogleLogin();
    }, [searchParams, router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ILoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        try {
            const code = searchParams.get("code");
            // console.log("OAuth Code:", code);
            if (!code) {
                throw new Error("No OAuth code found in URL.");
            }
    
            const result = await authService.loginGoogle(code);
    
            logIn(result.token, result.user);
            setUser(result.user);
            // console.log("Login successful:", result);
            router.push("/space");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleGoogleLogin = () => {
        const clientId = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
        // console.log("Google Client ID:", clientId);
        const redirectUri = "https://cse-tcsharing.io.vn/auth/log-in";
        const scope = "email profile";
    
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scope)}&` +
            `access_type=offline&` +
            `prompt=consent`;
    
        window.location.href = authUrl;
    };

    return (
        <form className="text-start w-full max-w-[800px] px-8 py-12 rounded-md bg-grey shadow-sm" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="w-full">
                    <label className="font-semibold text-sm" htmlFor="LoginEmail">
                        {t('email')}
                    </label>
                    <input
                        id="LoginEmail"
                        type="email"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="name.name@hcmut.edu.vn"
                        {...register('email')}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className="w-full">
                    <label className="font-semibold text-sm" htmlFor="LoginPassword">
                        {t('password')}
                    </label>
                    <input
                        id="LoginPassword"
                        type="password"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="********"
                        {...register('password')}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className="w-full flex flex-row gap-4 justify-between items-center">
                    <div className="flex items-center">
                        <input
                            id="RememberMe"
                            type="checkbox"
                            className="mr-2 rounded"
                            {...register('remember')}
                        />
                        <label className="font-medium text-sm" htmlFor="RememberMe">
                            {t('options.remember_me')}
                        </label>
                    </div>
                    <p className="font-medium text-sm text-blue-500 hover:underline">
                        <Link href={'/auth/forgot-password'}>
                            {t('options.forgot_password')}
                        </Link>
                    </p>
                </div>
                <button
                    disabled={true}
                    type="submit"
                    className="w-full p-2 rounded-lg text-base font-semibold text-white bg-black disabled:bg-opacity-80 hover:bg-opacity-80"
                >
                    {isSubmitting ? t('loading_text') : t('options.login')}
                </button>
                <div className="flex flex-row items-center gap-6 w-full">
                    <hr className="w-full border-t-2 border-gray-300" />
                    <p className="text-center">{t('or')}</p>
                    <hr className="w-full border-t-2 border-gray-300" />
                </div>
                <button
                    // href={''}
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full p-2 text-center justify-center rounded-lg text-base font-semibold text-white bg-blue-500 hover:bg-blue-400"
                >
                    {/* <button 
                        onClick={handleGoogleLogin}
                        type="button"> */}
                        {t('options.login_with_google')}
                    {/* </button> */}
                </button>
                <div className="text-center">
                    <span className="me-2 text-black font-normal">{t('register_text')}</span>{" "}
                    <Link
                        href={'/auth/register'}
                        className="inline-block font-semibold text-black dark:text-white hover:underline"    
                    >
                        {t('options.register')}
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default LoginForm