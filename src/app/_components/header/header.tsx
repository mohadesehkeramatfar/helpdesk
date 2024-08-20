'use client';
import { Button, Dropdown, Flex, Spin, Typography } from 'antd';
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
} from '@/lib/services/routes';
import { LuUser } from 'react-icons/lu';
import { LiaSignInAltSolid } from 'react-icons/lia';
import { useEffect, useState } from 'react';
import { handleRouter } from '@/lib/utils';
import { MenuProps } from 'antd/lib';
import { IoIosArrowDown } from 'react-icons/io';
const { Text } = Typography;
const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(true);
  const { isDesktop, isMobile } = useResponsive();
  const [userInfo, setUserInfo] = useState('');

  const logoutHandler = (e) => {
    e.preventDefault();
    removeStorage('user_id');
    removeStorage('user_name');
    removeCookies('access');
    removeCookies('refresh');
    router.push('/');
    setLoading(true);
  };
  const handleSendTicket = () => {
    handleRouter(router, 'send-ticket');
  };
  const handleMyTicket = (e: { preventDefault: () => void }) => {
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
      title: 'تیکت‌های من',
      href: myTicketPageRoute,
      onclick: handleMyTicket,
    },
  ];

  const items: MenuProps['items'] = [
    {
      label: <Link href={''}>پروفایل</Link>,
      key: '0',
    },
    {
      label: <Link href={''}>تیکت‌های من</Link>,
      key: '1',
    },

    {
      label: (
        <Link onClick={logoutHandler} href={''}>
          خروج
        </Link>
      ),
      key: '3',
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
        <div className={`${style.right_side}`}>
          <Image
            className={`${style.logo}`}
            width={isMobile ? 50 : 70}
            height={isMobile ? 30 : 40}
            alt={'تی‌ویژه'}
            src="/logo/TV.png"
          />
          {isDesktop && (
            <ul className={`${style.list_menu}`}>
              {listMenu.map((item, index) => {
                let activeTab = false;
                if (item.href === '/' && path === '/') {
                  activeTab = true;
                } else if (item.href !== '/' && path.startsWith(item.href))
                  activeTab = true;

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
        </div>
        <div className={`${style.left_side}`}>
          {isDesktop && (
            <Button type="primary" onClick={handleSendTicket}>
              ارسال تیکت
            </Button>
          )}
          {getCookies('access') ? (
            <div className={`${style.auth_container}`}>
              {loading ? (
                <Spin />
              ) : (
                <>
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Flex align="center">
                        <LuUser size={20} />
                        <IoIosArrowDown size={17} />
                      </Flex>
                    </a>
                  </Dropdown>
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
    </div>
  );
};

export default Header;
