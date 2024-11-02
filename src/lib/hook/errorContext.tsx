'use client';
import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const router = useRouter();

  const handleError = (error: { response: { status: number } }) => {
    const status = error?.response?.status;
    if (!status) return;
    switch (status) {
      case 403:
        toast.error('شما مجاز به دسترسی به این بخش نیستید');
        router.push('/access-denied');
        break;
      case 404:
        toast.error('صفحه مورد نظر یافت نشد');
        router.push('/not-found');
        break;
      case 500:
        toast.error(
          'مشکلی در سرور به وجود آمده است, لطفا با پشتیبانی تماس بگیرید',
        );

        // router.push('/server-error');
        break;
      default:
        toast.error('یک خطای ناشناخته به وجود آمده است');
    }
  };

  return (
    <ErrorContext.Provider value={{ handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
