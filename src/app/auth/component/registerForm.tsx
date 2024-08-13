'use client';
import {
  useGetBuildingsList,
  useGetFacingSideList,
} from '@/app/(users)/api/unitList';
import { usePostUnitRegister } from '../api/auth';
import AuthForm from './authForm/authForm';
import { extractDropDownItems, validateNumber } from '@/lib/utils';
import { Input, Select, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { generalMessage, successfulUnitRegister } from '@/lib/alertMessage';
import { setRefreshToken, setToken } from '@/lib/token';
import { setStorage } from '@/lib/storage';
import { ToastComponent } from '@/app/_components/toast/toast';

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const { trigger: postUnitRegister, isMutating: isLoadingPostUnitRegister } =
    usePostUnitRegister();
  const { data: getBuildingList, isLoading: loadingGetBuildingList } =
    useGetBuildingsList();
  const { data: getFacingSideList, isLoading: loadingGetFacingSideList } =
    useGetFacingSideList();

  const registerHandler = async (values: {
    first_name: string;
    last_name: string;
    unit_number: string;
    building: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { first_name, last_name, unit_number, building, password } = values;

    const data = {
      first_name,
      last_name,
      phone,
      unit_number,
      building,
      password: password || undefined,
    };
    if (Number(unit_number) > 32000) {
      toast.error('شماره واحد نباید بزرگتر از 32,000 باشد');
      return;
    }

    try {
      const registerResponse = await postUnitRegister({ data });
      const userName =
        registerResponse.data.first_name +
        ' ' +
        registerResponse.data.last_name;
      setToken(registerResponse.data.tokens.access);
      setStorage('user_name', userName);

      setRefreshToken(registerResponse.data.tokens.refresh);
      toast.success(successfulUnitRegister);
      router.push('/send-ticket');
    } catch (error) {
      toast.error(generalMessage);
    }
  };

  if (loadingGetBuildingList || loadingGetFacingSideList) {
    return <Spin />;
  }

  const formItems = [
    {
      name: 'first_name',
      label: 'نام',

      component: Input,
      rules: [{ required: true, message: 'نام را وارد کنید' }],
    },
    {
      name: 'last_name',
      label: 'نام خانوادگی',
      component: Input,
      rules: [{ required: true, message: 'نام خانوادگی را وارد کنید' }],
    },

    {
      name: 'unit_number',
      label: 'شماره واحد',
      component: Input,
      rules: [
        { required: true, message: 'شماره واحد را وارد کنید' },
        { validator: validateNumber },
      ],
    },
    {
      name: 'facing_side',
      label: 'جهت واحد',
      component: Select,
      options: extractDropDownItems(getFacingSideList?.data),
    },
    {
      name: 'building',
      label: 'ساختمان',
      rules: [{ required: true, message: 'ساختمان را وارد کنید' }],
      component: Select,
      options: extractDropDownItems(getBuildingList?.data),
    },
    {
      name: 'password',
      label: 'رمز عبور',
      component: Input.Password,
    },
    {
      name: 'confirmPassword',
      label: 'تکرار رمز عبور',
      component: Input.Password,
      dependencies: ['password'],
      rules: [
        ({ getFieldValue }) => ({
          validator(_: any, value: string) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('پسورد همخوانی ندارد!'));
          },
        }),
      ],
    },
  ].filter(Boolean);
  return (
    <>
      <ToastComponent />
      <AuthForm
        formItems={formItems}
        finishFormHandler={registerHandler}
        loading={isLoadingPostUnitRegister}
        children={undefined}
      />
    </>
  );
};

export default RegisterForm;
