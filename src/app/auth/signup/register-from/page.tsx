'use client';

import dynamic from 'next/dynamic';
import AuthSkeleton from '../../component/authSkeleton/authSkeleton';

const RegisterForm = dynamic(() => import('../../component/registerForm'), {
  loading: () => <AuthSkeleton />,
});

const RegisterFormPage = () => {
  return <RegisterForm />;
};

export default RegisterFormPage;
