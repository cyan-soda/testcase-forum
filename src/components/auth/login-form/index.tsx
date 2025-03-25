'use client'

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from "@/context/auth"

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

    // const { login } = useAuth() // todo: useAuth hook is not implemented yet
    const router = useRouter()
    const { login } = useAuth();

    useEffect(() => {
        console.log("useEffect is running...");
        const code = searchParams.get("code");
        console.log("OAuth Code:", code);
    
        if (code) {
            fetch("http://localhost:3000/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Google Login Success:", data);
                if(data.token){
                    login(data.token, data.user);
                    // localStorage.setItem("token", data.token);
                    // localStorage.setItem("user", JSON.stringify(data.user));
                }
                // login(data.token, data.user);
                router.push("/");
            })
            .catch(error => console.error("Error exchanging code for token:", error));
        }
    }, [searchParams, router]);
    
    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     formState: { errors, isSubmitting, isLoading }
    // } = useForm<ILoginForm>({
    //     resolver: yupResolver(loginSchema),
    //     defaultValues: {
    //         email: '',
    //         password: '',
    //         remember: false
    //     }
    // })

    // const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    //     try {
    //         // await login(data) // todo: useAuth hook is not implemented yet
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

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
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Login failed! Please check your credentials.");
            }

            const result = await response.json();
            login(result.token, result.user); // ✅ Lưu thông tin vào AuthContext
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            // alert(error.message);
        }
    };

    const handleGoogleLogin = () => {
        const clientId = "xxxxxxxxxxxxxxxxx.apps.googleusercontent.com";
        const redirectUri = "http://localhost:3001/auth/log-in";
        const scope = "email profile";
    
        const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
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
                        Email:
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
                        Password:
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
                            Remember me
                        </label>
                    </div>
                    <p className="font-medium text-sm text-blue-500 hover:underline">
                        <Link href={'/auth/forgot-password'}>
                            Forgot password?
                        </Link>
                    </p>
                </div>
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full p-2 rounded-lg text-base font-semibold text-white bg-black disabled:bg-grey hover:bg-opacity-80"
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <div className="flex flex-row items-center gap-6 w-full">
                    <hr className="w-full border-t-2 border-gray-300" />
                    <p className="text-center">or</p>
                    <hr className="w-full border-t-2 border-gray-300" />
                </div>
                <Link
                    href={''}
                    type="submit"
                    className="w-full p-2 text-center justify-center rounded-lg text-base font-semibold text-white bg-blue-500 hover:bg-blue-400"
                >
                    <button 
                        onClick={handleGoogleLogin}
                        type="button">
                    Login with Google
                    </button>
                </Link>
                <div className="text-center">
                    <span className="me-2 text-black font-normal">Have not registered?</span>{" "}
                    <Link
                        href={'/auth/register'}
                        className="inline-block font-semibold text-black dark:text-white hover:underline"    
                    >
                        Register now
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default LoginForm