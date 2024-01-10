import { ResetForm } from "@/components/auth/reset-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset - Flame Auth',
}

const ResetPage = () => {
  return (
    <ResetForm />
  )
}

export default ResetPage;