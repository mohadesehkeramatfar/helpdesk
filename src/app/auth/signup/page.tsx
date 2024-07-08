'use client';

import dynamic from 'next/dynamic';
import AuthSkeleton from '../component/authSkeleton/authSkeleton';

const OtpSignup = dynamic(() => import('../component/otpSignup'), {
  loading: () => <AuthSkeleton />,
});
const OtpSignupPage = () => {
  return <OtpSignup />;
};

export default OtpSignupPage;
