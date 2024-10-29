'use client';

import withAuth from '@/app/_components/withAuth/WithAuth';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';

const SendTicket = dynamic(() => import('../component/sendTicket/sendTicket'), {
  loading: () => <Spin />,
});

const SendTicketPage = () => {
  return <SendTicket />;
};

export default withAuth(SendTicketPage);
