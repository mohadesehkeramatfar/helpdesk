export const getStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  return window.JSON.parse(localStorage.getItem(key));
};
export const setStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  return window.localStorage.setItem(key, JSON.stringify(value));
};
export const removeStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  return localStorage.removeItem(key);
};
