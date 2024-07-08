'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostValidateOtp, useSubmitLogin } from '../api/auth';
import AuthForm from './authForm/authForm';
import { Button, Form, Input } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { generalMessage } from '@/lib/alertMessage';
import { setRefreshToken, setToken } from '@/lib/token';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useEffect, useRef, useState } from 'react';

const OtpSignin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const authentication_ref_id = searchParams.get('authentication_ref_id');
  const { trigger: postValidateOTP, isMutating: isLoadingPostValidateOtp } =
    usePostValidateOtp();
  const { trigger: submitLogin, isMutating: isLoadingSubmitLogin } =
    useSubmitLogin();
  const [otpDisable, setOtpDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  // 60000

  const otpHandler = async (values: { otp: string }) => {
    const { otp } = values;
    if (!otp) return;
    try {
      const data = {
        phone,
        action: 'login',
        otp_code: otp,
        authentication_ref_id,
      };
      const responsedLogin = await postValidateOTP({ data });
      setToken(responsedLogin.data.access);
      setRefreshToken(responsedLogin.data.refresh);
      router.push('/send-ticket');
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const reOtpHandler = async () => {
    if (!isActive) {
      setTimeLeft(60);
      setIsActive(true);
      setOtpDisabled(false);

      const data = {
        phone,
      };
      try {
        await submitLogin({ data });
      } catch (error) {
        toast.error(generalMessage);
      }
    }
  };
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setOtpDisabled(true);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formItems = [
    {
      name: 'otp',
      label: 'کد OTP',
      component: Input,
      disabled: otpDisable,
      showReRequestBtn: true,
      children: [
        {
          component: Button,
          text: isActive
            ? `${timeLeft}  ثانیه مانده تا دریافت مجدد کد`
            : 'درخواست مجدد کد',
          type: 'link',
          onClick: reOtpHandler,
          disabled: isActive,
        },
      ],
      rules: [{ required: true, message: 'کد OTP را وارد کنید' }],
    },
  ];
  return (
    <>
      <ToastComponent />

      <AuthForm
        formItems={formItems}
        finishFormHandler={otpHandler}
        loading={isLoadingPostValidateOtp}
      >
        {' '}
        <p>* لطفا کد وارد کنید</p>
      </AuthForm>
    </>
  );
};

export default OtpSignin;
