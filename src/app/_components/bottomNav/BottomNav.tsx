'use client';
import useResponsive from '@/lib/hook/useResponsive';
import { Menu } from 'antd';
import { PiPhone } from 'react-icons/pi';
import { RiHome2Line } from 'react-icons/ri';
import { VscSend } from 'react-icons/vsc';
import style from './bottomNav.module.scss';
import { IoListOutline } from 'react-icons/io5';
const menuItem = [
  {
    key: 'home',
    title: 'صفحه اصلی',
    icon: <RiHome2Line size={22} />,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  {
    key: 'send_ticket',
    title: 'ارسال تیکت',
    icon: <VscSend size={22} />,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  {
    key: 'myTicket',
    title: 'تیکت‌های من',
    icon: <IoListOutline size={22} />,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  {
    key: 'contactUs',
    title: 'تماس با ما',
    icon: <PiPhone size={22} />,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
];
const BottomNav = () => {
  const { isDesktop } = useResponsive();
  return (
    !isDesktop && (
      <div className={`${style.container}`}>
        <div className={`${style.div}`}></div>
        <Menu
          mode="horizontal"
          className={`${style.menu}`}
          style={{
            borderTop: '1px solid #f0f0f0',
            padding: '10px 0',
            position: 'fixed',
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
          }}
        >
          {menuItem.map((item) => (
            <Menu.Item
              className={style.menu_item}
              key={item.key}
              icon={item.icon}
              style={item.style}
            >
              {item.title}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    )
  );
};
export default BottomNav;
