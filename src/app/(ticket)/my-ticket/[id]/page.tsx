'use client';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

const TicketDetail = dynamic(
  () => import('../../component/myTickets/ticketDetail/TicketDetail'),
  {
    loading: () => <Spin />,
  },
);

const TicketDetailPage = () => {
  return <TicketDetail />;
};

export default TicketDetailPage;
