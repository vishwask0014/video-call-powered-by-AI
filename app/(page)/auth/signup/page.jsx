import React from "react";
import SignupForm from "./SignupForm";
import AuthLayout from "@/app/components/AuthLayout";

const Page = () => {
    return (
        <>
            <AuthLayout>
                <SignupForm />
            </AuthLayout>

        </>
    );
};

export default Page;