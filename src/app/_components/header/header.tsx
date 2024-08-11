'use client';
import { Button, Tooltip } from 'antd';
import style from './header.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookies, removeCookies } from '@/lib/cookies';
import { getStorage, removeStorage } from '@/lib/storage';
import { GoSignIn } from 'react-icons/go';
import { CiLogout } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import globalStyle from '../../layout.module.scss';
import useResponsive from '@/lib/hook/useResponsive';

const Header = () => {
  const router = useRouter();
  const [userLable, setUserlable] = useState('ورود');
  const user_info = getStorage('user_name' ?? '{}');
  const { isDesktop, isMobile, isTablet } = useResponsive();

  const logoutHandler = () => {
    removeStorage('user_id');
    removeStorage('user_name');
    removeCookies('access');
    removeCookies('refresh');
    setUserlable('ورود');
    router.push('/');
  };
  const handleSendTicket = (e) => {
    e.preventDefault();
    const accessTokenValue = getCookies('access');
    if (!accessTokenValue) {
      router.push(`/auth/signin/?send-ticket=send-ticket`);
    } else router.push(`/send-ticket`);
  };

  useEffect(() => {
    if (user_info) setUserlable(user_info);
  }, [userLable, router]);

  return (
    <div className={`${style.header_container}`}>
      {/* header_container */}
      <div className={`${globalStyle.container} ${style.header}`}>
        <Image
          className={`${style.logo}`}
          width={120}
          height={60}
          alt={'تی‌ویژه'}
          src="/logo/TV.png"
        />
        {isDesktop && (
          <ul className={`${style.list_menu}`}>
            <li>
              <Link href="/">صفحه اصلی</Link>
            </li>
            <li>
              <Link href="">تماس با ما</Link>
            </li>
            <li>
              <Link href={''} onClick={handleSendTicket}>
                ارسال تیکت
              </Link>
            </li>
            <li>
              <Link href={'/my-ticket'}>تیکت های من</Link>
            </li>
          </ul>
        )}

        {getCookies('access') ? (
          <div className={`${style.auth_container}`}>
            {' '}
            <Button type="text">{userLable}</Button>
            <Tooltip title="خروج">
              {' '}
              <Button type="text" onClick={logoutHandler}>
                {' '}
                <CiLogout size={22} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <Button type="default" onClick={() => router.push('/auth/signin')}>
            {userLable}
            <GoSignIn size={21} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
