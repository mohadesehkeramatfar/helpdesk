import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getCookies } from './cookies';

export const extractDropDownItems = (response: any[]) => {
  return response.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

export const validatePhoneNumber = (_: any, value: string) => {
  const phoneNumberRegex = /^[0-9]{11}$/;
  if (value && !phoneNumberRegex.test(value)) {
    return Promise.reject(
      new Error('شماره موبایل باید 11 رقم و فقط شامل اعداد باشد'),
    );
  }
  return Promise.resolve();
};

export const validateNumber = (_: any, value: string) => {
  const numberRegex = /^[0-9\b]+$/;
  if (value && !numberRegex.test(value)) {
    return Promise.reject(new Error('مقدار فقط شامل اعداد باشد'));
  }
  return Promise.resolve();
};

export const handleRouter = (
  router: AppRouterInstance | string[],
  searchParams: string,
) => {
  const accessTokenValue = getCookies('access');
  if (!accessTokenValue) {
    router.push(`/auth/signin/?${searchParams}=${searchParams}`);
  } else router.push(`/${searchParams}`);
};
