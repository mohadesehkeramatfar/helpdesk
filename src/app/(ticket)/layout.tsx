'use client';
import { useEffect, useState } from 'react';
import Header from '../_components/header/header';
import globalStyle from '../layout.module.scss';
import { Spin } from 'antd';
import style from './layout.module.scss';
const TicketLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <Spin />;
  }
  return (
    <div className={`${style.main}`}>
      <Header />
      <div
        style={{ marginTop: '100px' }}
        className={`${globalStyle.container}`}
      >
        {children}
      </div>
    </div>
  );
};

export default TicketLayout;
