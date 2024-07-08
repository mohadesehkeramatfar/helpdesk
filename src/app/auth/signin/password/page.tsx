'use client';

import dynamic from 'next/dynamic';
import AuthSkeleton from '../../component/authSkeleton/authSkeleton';

const PasswordSigin = dynamic(() => import('../../component/passwordSignin'), {
  loading: () => <AuthSkeleton />,
});
const PasswordPage = () => {
  return <PasswordSigin />;
};
export default PasswordPage;
