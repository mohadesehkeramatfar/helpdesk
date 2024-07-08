import axios, { AxiosRequestConfig } from 'axios';
// import { getRefreshToken, getToken, setToken } from '../token';
import { API_ENDPOINTS } from './endpoints';

export const client = axios.create({
  baseURL: 'http://172.16.203.57:8080',
});

// const renewToken = async () => {
//   const response = await client({
//     url: API_ENDPOINTS.REFRESH_TOKEN,
//     method: 'POST',
//     data: {
//       refresh: getRefreshToken(),
//     },
//   });

//   if (response.status != 200) {
//     // TODO: Renew failed. What to do?
//     return;
//   }

//   setToken(response.data.access);
//   return response.data.access;
// };

export const request = async (
  url: string,
  method: string,
  data?: any,
  secure?: boolean,
  isFormData?: boolean,
) => {
  const config: AxiosRequestConfig = {
    url: url,
    method: method,
    data: data,
  };

  if (secure) {
    // let token = getToken();
    // getPrivileges();

    // if (!token) {
    //   token = await renewToken();
    // }
    config.headers = {
      'Content-Type': isFormData ? `multipart/form-data` : 'application/json',
      //   Authorization: `Bearer ${token}`,
    };
  }

  let response;
  response = await client(config);

  return response;
};
