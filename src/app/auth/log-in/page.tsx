import LoginForm from "@/components/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense>
            <div className="w-full h-full flex flex-col items-center justify-center mt-20">
                <LoginForm />
            </div>
        </Suspense>
    )
}