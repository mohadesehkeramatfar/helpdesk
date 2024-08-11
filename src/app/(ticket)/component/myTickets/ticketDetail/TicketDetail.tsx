import { useTicketDetail } from '@/app/(ticket)/api/ticket';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const TicketDetail = () => {
  const { id } = useParams();
  const { trigger: getTicket } = useTicketDetail();
  //   console.log('useTicketDetail', data);
  const fetchData = async () => {
    try {
      const x = await getTicket({ id });
      console.log('xxx', x);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  return <>TicketDetail</>;
};
export default TicketDetail;
