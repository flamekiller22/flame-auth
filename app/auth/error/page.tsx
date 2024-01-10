import { ErrorCard } from "@/components/auth/error-card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error - Flame Auth',
}

const AuthErrorPage = () => {
  return (
    <ErrorCard />
  )
}

export default AuthErrorPage;