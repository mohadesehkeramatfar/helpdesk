import { useRouter, useSearchParams } from 'next/navigation';
import { useGetUserInfo, usePostUnitLogin } from '../api/auth';
import AuthForm from './authForm/authForm';
import { Input } from 'antd';
import { ToastComponent } from '@/app/_components/toast/toast';
import { toast } from 'react-toastify';
import {
  generalMessage,
  unitSuccessfullRegister,
  wrongPassword,
} from '@/lib/alertMessage';
import { setRefreshToken, setToken } from '@/lib/token';
import { setStorage } from '@/lib/storage';

const PasswordSignin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trigger: postUnitLogin } = usePostUnitLogin();
  const { trigger: getUserInfo } = useGetUserInfo();
  const phone = searchParams.get('phone');

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
      router.push('/send-ticket');
    } catch (error) {
      if (error?.response?.data[0] == 'Unit not found') {
        toast.error(wrongPassword);
      } else {
        toast.error(generalMessage);
      }
    }
    // try {
    //   const getUserInfoResponsed = await getUserInfo();
    //   console.log('getUserInfoResponsed', getUserInfoResponsed);
    // } catch (error) {
    //   console.log('erorr 2222', error);
    // }
  };
  const formItems = [
    {
      name: 'password',
      label: 'رمز عبور',
      component: Input.Password,
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
