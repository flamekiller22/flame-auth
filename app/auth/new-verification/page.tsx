import { NewVerificationForm } from "@/components/auth/new-verification-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Verification - Flame Auth',
}

const NewVerificationPage = () => {
  return (
    <NewVerificationForm />
  )
}

export default NewVerificationPage;