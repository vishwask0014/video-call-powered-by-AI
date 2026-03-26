import React from "react";
import LoginForm from "./LoginForm";
import AuthLayout from "@/app/components/AuthLayout";

const Page = () => {
    return (
        <>
            <AuthLayout>
                <LoginForm />
            </AuthLayout>

        </>
    );
};

export default Page;