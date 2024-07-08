import { useRouter } from 'next/navigation';
import AuthForm from './authForm/authForm';
import { useSubmitLogin } from '../api/auth';
import { Input } from 'antd';
import { validatePhoneNumber } from '@/lib/utils';
import { toast } from 'react-toastify';
import { ToastComponent } from '@/app/_components/toast/toast';
import { generalMessage } from '@/lib/alertMessage';
const Signin = () => {
  const router = useRouter();
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
        router.push(`signup?${queryString}`);

        return;
      } else {
        if (submitLoginResponsed.method === 'password') {
          router.push(`signin/password?phone=${submitLoginResponsed.phone}`);
          return;
        }

        if (submitLoginResponsed.method === 'otp') {
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
        <>
          <h2>ثبت نام | ورود</h2>
          <p>* لطفا شماره موبایل خود را وارد کنید</p>
        </>
      </AuthForm>
    </>
  );
};

export default Signin;
