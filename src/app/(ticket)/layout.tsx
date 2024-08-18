'use client';
import { useEffect, useState } from 'react';
import Header from '../_components/header/header';
import globalStyle from '../layout.module.scss';
import { Spin } from 'antd';
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
    <>
      <Header />
      <div className={`${globalStyle.container}`}>{children}</div>
    </>
  );
};

export default TicketLayout;
