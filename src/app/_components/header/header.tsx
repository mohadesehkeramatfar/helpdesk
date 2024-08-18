'use client';
import { Button, Spin } from 'antd';
import style from './header.module.scss';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookies, removeCookies } from '@/lib/cookies';
import { getStorage, removeStorage } from '@/lib/storage';
import globalStyle from '../../layout.module.scss';
import useResponsive from '@/lib/hook/useResponsive';
import {
  contactUsPageRoute,
  homePageRoute,
  myTicketPageRoute,
  sendTicketPageRoute,
} from '@/lib/services/routes';
import { LuUser } from 'react-icons/lu';
import { LiaSignInAltSolid, LiaSignOutAltSolid } from 'react-icons/lia';
import { useEffect, useState } from 'react';
import { handleRouter } from '@/lib/utils';

const Header = () => {
  const router = useRouter();
  const path = usePathname();

  const [loading, setLoading] = useState(true);
  const { isDesktop, isMobile } = useResponsive();
  const [userInfo, setUserInfo] = useState('');

  const logoutHandler = () => {
    removeStorage('user_id');
    removeStorage('user_name');
    removeCookies('access');
    removeCookies('refresh');
    router.push('/');
    setLoading(true);
  };
  const handleSendTicket = (e) => {
    e.preventDefault();
    handleRouter(router, 'send-ticket');
  };
  const handleMyTicket = (e) => {
    e.preventDefault();
    handleRouter(router, 'my-ticket');
  };
  const listMenu = [
    {
      id: 0,
      title: 'صفحه اصلی',
      href: homePageRoute,
      onclick: null,
    },
    {
      id: 1,
      title: 'تماس با ما',
      href: contactUsPageRoute,
      onclick: null,
    },
    {
      id: 2,
      title: 'ارسال تیکت',
      href: sendTicketPageRoute,
      onclick: handleSendTicket,
    },
    {
      id: 3,
      title: 'تیکت‌های من',
      href: myTicketPageRoute,
      onclick: handleMyTicket,
    },
  ];
  useEffect(() => {
    if (loading) {
      setUserInfo(getStorage('user_name' ?? ''));
      setLoading(false);
    }
  }, [loading]);

  return (
    <div className={`${style.header_container}`}>
      <div className={`${globalStyle.container} ${style.header}`}>
        <Image
          className={`${style.logo}`}
          width={isMobile ? 60 : 90}
          height={isMobile ? 40 : 60}
          alt={'تی‌ویژه'}
          src="/logo/TV.png"
        />
        {isDesktop && (
          <ul className={`${style.list_menu}`}>
            {listMenu.map((item, index) => {
              let activeTab = false;

              if (path === item.href) activeTab = true;

              return (
                <li data-active={activeTab} key={index}>
                  <Link href={item.href} onClick={item.onclick}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {getCookies('access') ? (
          <div className={`${style.auth_container}`}>
            {loading ? (
              <Spin />
            ) : (
              <>
                {' '}
                <Button icon={<LuUser size={20} />} type="text">
                  {userInfo}
                </Button>
                <Button
                  onClick={logoutHandler}
                  icon={<LiaSignOutAltSolid size={20} />}
                  type="text"
                >
                  خروج
                </Button>
              </>
            )}
          </div>
        ) : (
          <Button
            icon={<LiaSignInAltSolid size={20} />}
            type="text"
            onClick={() => router.push('/auth/signin')}
          >
            ورود
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
