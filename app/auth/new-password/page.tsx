import { NewPasswordForm } from "@/components/auth/new-password-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Password - Flame Auth',
}

const NewPasswordPage = () => {
  return (
    <NewPasswordForm />
  )
}

export default NewPasswordPage;