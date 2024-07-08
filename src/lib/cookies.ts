export const getCookies = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts != undefined && parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

export const setCookies = (
  name: string,
  value: string,
  expires: number = 0,
  sameSite: 'Lax' | 'Strict' | 'None' = 'Lax',
  path: string = '/',
  domain: string = 'localhost',
): void => {
  if (name.length * value.length === 0)
    throw new Error('Invalid name or value for cookie');
  let expireUTC = '';
  if (expires != 0) {
    var date = new Date(expires);
    expireUTC = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${value}${expireUTC}; path=${path}; SameSite=${sameSite}; Domain=${domain}`;
};

export const removeCookies = (
  name: string,
  path: string = '/',
  domain: string = 'localhost',
) => {
  document.cookie = `${name}=; Max-Age=-1; path=${path}; Domain=${domain}`;
};
