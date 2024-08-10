'use client';

import dynamic from 'next/dynamic';
import AuthSkeleton from '../component/authSkeleton/authSkeleton';

const Signin = dynamic(() => import('../component/siginForm'), {
  loading: () => <AuthSkeleton />,
});

const LoginPage = () => {
  return <Signin />;
};

export default LoginPage;
