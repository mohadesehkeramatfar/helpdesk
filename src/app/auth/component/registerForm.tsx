'use client';
import {
  useGetBuildingsList,
  useGetFacingSideList,
} from '@/app/(users)/api/unitList';
import { usePostUnitRegister } from '../api/auth';
import AuthForm from './authForm/authForm';
import { extractDropDownItems, validateNumber } from '@/lib/utils';
import { Input, Select, Spin, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setRefreshToken, setToken } from '@/lib/token';
import { getStorage, removeStorage, setStorage } from '@/lib/storage';
import { generalMessage, successfulUnitRegister } from '@/lib/alertMessage';
import { myTicketPageRoute, sendTicketPageRoute } from '@/lib/services/routes';
const { Title } = Typography;
const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const sendTicket = searchParams.get('send-ticket');
  const myTicket = searchParams.get('my-ticket');
  const authentication_ref_id = searchParams.get('authentication_ref_id');
  const { trigger: postUnitRegister, isMutating: isLoadingPostUnitRegister } =
    usePostUnitRegister();
  const { data: getBuildingList, isLoading: loadingGetBuildingList } =
    useGetBuildingsList();
  const { data: getFacingSideList, isLoading: loadingGetFacingSideList } =
    useGetFacingSideList();
  const [facingSideList, setFacingSideList] = useState([]);
  const registerHandler = async (values: {
    first_name: string;
    last_name: string;
    unit_number: string;
    building: string;
    password: string;
    confirmPassword: string;
    facing_side: string;
  }) => {
    const {
      first_name,
      last_name,
      unit_number,
      building,
      facing_side,
      password,
    } = values;
    const otp_code = getStorage('otp_code');
    const data = {
      first_name,
      last_name,
      phone,
      unit_number,
      building,
      facing_side,
      password: password || null,
      authentication_ref_id: authentication_ref_id,
      semver: null,
      otp_code,
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
      removeStorage('otp_code');
      if (sendTicket) {
        router.push(sendTicketPageRoute);
        return;
      }
      if (myTicket) {
        router.push(myTicketPageRoute);
        return;
      }
      router.push('/');
    } catch (error) {
      toast.error(generalMessage);
    }
  };

  if (loadingGetBuildingList || loadingGetFacingSideList) {
    return <Spin />;
  }
  const handleBuildingList = (e) => {
    const buildingListFiltered = getBuildingList?.data.filter(
      (item) => item.id === e,
    );
    setFacingSideList(buildingListFiltered[0].facing_sides);
  };

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
      name: 'building',
      label: 'ساختمان',
      rules: [{ required: true, message: 'ساختمان را وارد کنید' }],
      component: Select,
      options: extractDropDownItems(getBuildingList?.data),
      onChangeSelect: handleBuildingList,
    },
    {
      name: 'facing_side',
      label: 'جهت واحد',
      component: Select,
      options: extractDropDownItems(facingSideList),
      // options: facingSideList,
      // onChangeSelect: handleFacingList,
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
      >
        {' '}
        <Title level={4}>اطلاعات را وارد کنید</Title>
      </AuthForm>
    </>
  );
};

export default RegisterForm;
