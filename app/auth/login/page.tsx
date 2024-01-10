import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Flame Auth',
}

const LoginPage = () => {
  return (
    <LoginForm />
  )
}

export default LoginPage;