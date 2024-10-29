'use client';

import withAuth from '@/app/_components/withAuth/WithAuth';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';

// import MyTickets from '../component/myTickets/MyTickets';
const MyTickets = dynamic(() => import('../component/myTickets/MyTickets'), {
  loading: () => <Spin />,
  ssr: false,
});
const MyTicketPage = () => {
  return <MyTickets />;
};

export default withAuth(MyTicketPage);
