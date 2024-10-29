import { getCookies, setCookies } from './cookies';

import { setStorage } from './storage';
import { jwtDecode } from 'jwt-decode';
type DecodedToken = {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: string;
};
export const getToken = () => {
  return getCookies('access');
};

export const getRefreshToken = () => {
  return getCookies('refresh');
};

export const setToken = (token: string): void => {
  const decoded = decodeToken(token);
  setCookies('access', token, decoded.exp * 1000);
  setStorage('user_id', decoded.user_id);
};

export const decodeToken = (token?: string): DecodedToken => {
  let final_token = token;
  if (!final_token) final_token = getCookies('access');
  if (!final_token)
    throw new Error('Unable to decode token: token not provided');

  return jwtDecode(final_token);
};

export const setRefreshToken = (token: string) => {
  return setCookies('refresh', token);
};

export const isTokenExpired = (token?: string): boolean => {
  if (!token && !getCookies('access')) return true;
  return decodeToken(token).exp * 1000 <= Date.now();
};
