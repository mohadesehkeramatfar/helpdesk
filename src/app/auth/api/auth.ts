import { request } from '@/lib/services/baseURL';
import { API_ENDPOINTS } from '@/lib/services/endpoints';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const useSubmitLogin = () => {
  return useSWRMutation(API_ENDPOINTS.POST_SUBMIT_LOGIN, async (url, { arg }) =>
    request(url, 'POST', arg.data, false),
  );
};

//
export const usePostValidateOtp = () => {
  return useSWRMutation(API_ENDPOINTS.POST_VALIDATE_OTP, async (url, { arg }) =>
    request(url, 'POST', arg.data, false),
  );
};

export const usePostUnitLogin = () => {
  return useSWRMutation(API_ENDPOINTS.POST_UNIT_LOGIN, async (url, { arg }) =>
    request(url, 'POST', arg.data, false),
  );
};

export const usePostUnitRegister = () => {
  return useSWRMutation(
    API_ENDPOINTS.POST_UNIT_REGISTER,
    async (url, { arg }) => request(url, 'POST', arg.data, false),
  );
};

export const useGetUserInfo = () => {
  return useSWRMutation(API_ENDPOINTS.WHO_AM_I, async (url) => {
    return await request(url, 'GET', {}, true);
  });
};
