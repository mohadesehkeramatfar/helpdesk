'use client';

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

const SendTicket = dynamic(() => import('../component/sendTicket'), {
  ssr: false,
  loading: () => <Spin />,
});

const SendTicketPage = () => {
  return <SendTicket />;
};

export default SendTicketPage;
