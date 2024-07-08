'use client';

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../_components/header/header'), {
  ssr: false,
});

const SendTicket = () => {
  return (
    <>
      {' '}
      <Header />
    </>
  );
};

export default SendTicket;
