import { useRouter, useSearchParams } from 'next/navigation';
import { useGetUserInfo, usePostUnitLogin } from '../api/auth';
import AuthForm from './authForm/authForm';
import { Input } from 'antd';
import { ToastComponent } from '@/app/_components/toast/toast';
import { toast } from 'react-toastify';
import { generalMessage, wrongPassword } from '@/lib/alertMessage';
import { setRefreshToken, setToken } from '@/lib/token';
import { myTicketPageRoute, sendTicketPageRoute } from '@/lib/services/routes';
import { useRef } from 'react';

const PasswordSignin = () => {
  const router = useRouter();
  const refPassword = useRef();
  const searchParams = useSearchParams();
  const { trigger: postUnitLogin } = usePostUnitLogin();
  const { trigger: getUserInfo } = useGetUserInfo();

  const phone = searchParams.get('phone');
  const sendTicket = searchParams.get('send-ticket');
  const myTicket = searchParams.get('my-ticket');

  const passwordHandler = async (values: { password: string }) => {
    const { password } = values;
    try {
      const data = {
        password,
        phone,
      };
      const { data: responsedLogin } = await postUnitLogin({ data });
      const { tokens } = responsedLogin;
      setToken(tokens.access);
      setRefreshToken(tokens.refresh);

      if (sendTicket) {
        router.push(sendTicketPageRoute);
      } else if (myTicket) {
        router.push(myTicketPageRoute);
      } else {
        router.push('/');
      }
    } catch (error) {
      if (error?.response?.data[0] == 'Unit not found') {
        toast.error(wrongPassword);
      } else {
        try {
          const { data: getUserInfoResponsed } = await getUserInfo();
          const userName =
            getUserInfoResponsed.first_name +
            ' ' +
            getUserInfoResponsed.last_name;
        } catch (error) {
          toast.error(generalMessage);
        }
      }
    }
  };
  const formItems = [
    {
      name: 'password',
      label: 'رمز عبور',
      component: Input.Password,
      ref: refPassword,
      rules: [{ required: true, message: 'رمز را وارد کنید' }],
    },
  ];

  return (
    <>
      <ToastComponent />
      <AuthForm
        loading={undefined}
        formItems={formItems}
        finishFormHandler={passwordHandler}
      >
        {' '}
        <p>* لطفا رمز عبور را وارد کنید</p>
      </AuthForm>
    </>
  );
};
export default PasswordSignin;
