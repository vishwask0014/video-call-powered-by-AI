import AuthLayout from '@/app/components/AuthLayout'
import React from 'react'
import ForgotPasswordForm from './ForgotPasswordForm'

const page = () => {
    return (
        <AuthLayout>
            <ForgotPasswordForm />
        </AuthLayout>
    )
}

export default page