'use client';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import withAuth from '@/app/_components/withAuth/WithAuth';

const TicketDetail = dynamic(
  () => import('../../component/myTickets/ticketDetail/TicketDetail'),
  {
    loading: () => <Spin />,
  },
);

const TicketDetailPage = () => {
  return <TicketDetail />;
};

export default withAuth(TicketDetailPage);
