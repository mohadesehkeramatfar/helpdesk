'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from './authForm/authForm';
import { useSubmitLogin } from '../api/auth';
import { Input, Typography } from 'antd';
import { validatePhoneNumber } from '@/lib/utils';
import { ToastComponent } from '@/app/_components/toast/toast';
import { toast } from 'react-toastify';
import { generalMessage } from '@/lib/alertMessage';

const { Text, Title } = Typography;
const Signin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sendTicket = searchParams.get('send-ticket');
  const myTicket = searchParams.get('my-ticket');
  const { trigger: submitLogin, isMutating: isLoadingSubmitLogin } =
    useSubmitLogin();

  const formItem = [
    {
      name: 'phone',
      label: 'شماره تلفن',
      component: Input,
      rules: [
        { required: true, message: 'شماره تلفن را وارد کنید' },
        { validator: validatePhoneNumber },
      ],
    },
  ].filter(Boolean);
  const loginHandler = async (values: { phone: string }) => {
    const { phone } = values;
    if (!phone) return;
    const data = {
      phone,
    };

    try {
      const { data: submitLoginResponsed } = await submitLogin({ data });
      const params = {
        phone: submitLoginResponsed.phone,
        authentication_ref_id: submitLoginResponsed.authentication_ref_id,
      };
      const queryString = new URLSearchParams(params).toString();
      if (!submitLoginResponsed.has_account) {
        if (sendTicket) {
          router.push(`signup?${queryString}&send-ticket=send-ticket`);
          return;
        }
        if (myTicket) {
          router.push(`signup?${queryString}&my-ticket=my-ticket`);
          return;
        }
        router.push(`signup?${queryString}`);

        return;
      } else {
        if (submitLoginResponsed.method === 'password') {
          if (sendTicket) {
            router.push(
              `signin/password?phone=${submitLoginResponsed.phone}&send-ticket=send-ticket`,
            );
            return;
          }
          if (myTicket) {
            router.push(
              `signin/password?phone=${submitLoginResponsed.phone}&my-ticket=my-ticket`,
            );
            return;
          }
          router.push(`signin/password?phone=${submitLoginResponsed.phone}`);
          return;
        } else if (submitLoginResponsed.method === 'otp') {
          if (sendTicket) {
            router.push(`signin/otp/?${queryString}&send-ticket=send-ticket`);
            return;
          }
          if (myTicket) {
            router.push(`signin/otp/?${queryString}&my-ticket=my-ticket`);
            return;
          }
          router.push(`signin/otp/?${queryString}`);
        }
      }
    } catch (error) {
      toast.error(generalMessage);
    }
  };
  return (
    <>
      <ToastComponent />
      <AuthForm
        formItems={formItem}
        loading={isLoadingSubmitLogin}
        finishFormHandler={loginHandler}
      >
        <Title level={4}>ثبت نام | ورود</Title>
        <Text>* لطفا شماره موبایل خود را وارد کنید</Text>
      </AuthForm>
    </>
  );
};

export default Signin;
