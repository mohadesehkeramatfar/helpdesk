'use client';

import dynamic from 'next/dynamic';
import AuthSkeleton from '../../component/authSkeleton/authSkeleton';

const OtpSignin = dynamic(() => import('../../component/otpSignin'), {
  loading: () => <AuthSkeleton />,
});

const OTPPage = () => {
  return <OtpSignin />;
};
export default OTPPage;
