'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostValidateOtp } from '../api/auth';
import AuthForm from './authForm/authForm';
import { Button, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { generalMessage } from '@/lib/alertMessage';
import { ToastComponent } from '@/app/_components/toast/toast';
import { setStorage } from '@/lib/storage';

const OtpSignup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const sendTicket = searchParams.get('send-ticket');
  const myTicket = searchParams.get('my-ticket');
  const authentication_ref_id = searchParams.get('authentication_ref_id');
  const { trigger: postValidateOTP, isMutating: isLoadingPostValidateOtp } =
    usePostValidateOtp();
  const [otpDisable, setOtpDisabled] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const reOtpHandler = async () => {
    if (!isActive) {
      setTimeLeft(30);
      setIsActive(true);
      setOtpDisabled(false);
      try {
        // await submitLogin({ data });
      } catch (error) {
        toast.error(generalMessage);
      }
    }
  };
  const otpHandler = async (values: { otp: string }) => {
    const { otp } = values;
    if (!otp) return;
    try {
      const data = {
        phone,
        action: 'register',
        otp_code: otp,
        authentication_ref_id,
      };
      await postValidateOTP({ data });

      setStorage('otp_code', otp);
      if (sendTicket) {
        router.push(
          `signup/register-from/?phone=${phone}&authentication_ref_id=${authentication_ref_id}&send-ticket=send-ticket`,
        );
        return;
      }
      if (myTicket) {
        router.push(
          `signup/register-from/?phone=${phone}&authentication_ref_id=${authentication_ref_id}&my-ticket=my-ticket`,
        );
        return;
      }

      router.push(
        `signup/register-from/?phone=${phone}&authentication_ref_id=${authentication_ref_id}`,
      );
      return;
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const formItems = [
    {
      name: 'otp',
      label: 'لطفا کد OTP وارد کنید',
      component: Input,
      disabled: otpDisable,
      showReRequestBtn: true,
      style: { textAlign: 'center' },
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
  ].filter(Boolean);

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

  return (
    <>
      {' '}
      <ToastComponent />{' '}
      <AuthForm
        formItems={formItems}
        finishFormHandler={otpHandler}
        loading={isLoadingPostValidateOtp}
      />
    </>
  );
};

export default OtpSignup;
