/* eslint-disable react/display-name */
import { getCookies } from '@/lib/cookies';
import { handleRouter } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

const withAuth = (WrappedComponent: ComponentType) => {
  return (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();
    const pathName = usePathname().split('/')[1];

    useEffect(() => {
      if (!getCookies('access')) handleRouter(router, pathName);
    }, [pathName, router]);
    return getCookies('access') ? <WrappedComponent {...props} /> : null;
  };
};
export default withAuth;
