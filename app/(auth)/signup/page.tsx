'use client'

import { AuthLayout } from '@/features/auth/components/auth-layout'
import { SignUpForm } from '@/features/auth/components/signup-form'

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}

export default SignUpPage
