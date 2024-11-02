'use client';
import {
  Button,
  Divider,
  Flex,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import moment from 'moment-jalaali';
import {
  useGetTicketStatusTagReport,
  useGetUnitTicketList,
} from '../../api/ticket';
import style from './myTicket.module.scss';
import globalStyle from '@/app/layout.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CgDetailsMore } from 'react-icons/cg';
import { useError } from '@/lib/hook/errorContext';
const { Text, Title } = Typography;

const MyTickets = () => {
  const router = useRouter();
  const { handleError } = useError();
  const {
    data: getUnitTicketList,
    isLoading: getUnitTicketListLoading,
    error: getUnitTicketListError,
  } = useGetUnitTicketList();
  const {
    trigger: getTicketStatusTagReport,
    isMutating: ticketStatusTagReportLoading,
  } = useGetTicketStatusTagReport();
  const [statisticData, setStatisticData] = useState([]);
  const [ticketListPagination, setTicketListPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 50,
  });
  const handlePagination = (page: { current: number }) => {
    const { current } = page;
    setTicketListPagination({ ...ticketListPagination, current });
  };

  const fetchTicketStatusTagReport = async () => {
    try {
      const { data: ticketStatusTagReportResponsed } =
        await getTicketStatusTagReport();
      setStatisticData(ticketStatusTagReportResponsed);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchTicketStatusTagReport();
  }, []);

  if (getUnitTicketListError) {
    handleError(getUnitTicketListError);
    return;
  }
  if (
    getUnitTicketListLoading ||
    !getUnitTicketList ||
    ticketStatusTagReportLoading
  ) {
    return <Spin />;
  }
  const unitTicketListColumns = [
    {
      title: 'کد تیکت',
      dataIndex: 'ref_code',
      key: 'ref_code',
    },
    {
      title: 'عنوان درخواست',
      dataIndex: 'categories',
      key: 'categories',
      render: (
        categories: {
          parent: any;
          name: string;
        }[],
      ) => {
        return (
          <Flex vertical gap={'5px'}>
            {' '}
            <Text>{categories[0]?.name}</Text>
            <Text type="secondary">{categories[1]?.name}</Text>
          </Flex>
        );
      },
    },
    {
      title: 'تاریخ ثبت',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) => {
        return (
          <Flex vertical>
            {' '}
            <Text>{moment(created_at).format('jYYYY/jM/jD')}</Text>
            <Text type="secondary">{moment(created_at).format('HH:mm')}</Text>
          </Flex>
        );
      },
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status: { title: string; color: string }) => (
        <Tag color={status.color}>{status?.title}</Tag>
      ),
    },
    {
      title: 'جزئیات',
      dataIndex: 'detail',
      key: 'detail',
      render: (_text, record) => {
        return (
          <>
            <Button
              type="text"
              style={{ padding: 0 }}
              icon={
                <CgDetailsMore
                  size={20}
                  onClick={() => router.push(`/my-ticket/${record.id}`)}
                />
              }
            />
          </>
        );
      },
    },
  ];
  const unitTicketList = getUnitTicketList.data.results;

  return (
    <div className={`${style.my_ticket_container}`}>
      {/* TITLE CONTAINER */}
      <div className={`${style.title_container}`}>
        <Title level={4}>تیکت‌های من</Title>
        <div className={`${style.statistics_container}`}>
          {statisticData.map((item) => (
            <Statistic
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              title={<Text>{item.title}</Text>}
              value={item.ticket_count}
              // {item.value}
              valueStyle={{ color: item.color }}
            />
          ))}
        </div>
      </div>
      <Divider style={{ paddingBottom: 0, marginBottom: 0 }} />
      {/* TABLE CONTAINER */}
      <div className={`${style.table_container}`}>
        <Table
          rowClassName={() => globalStyle.customRowHeight}
          onRow={(record) => ({
            onClick: () => router.push(`/my-ticket/${record.id}`),
          })}
          dataSource={unitTicketList}
          columns={unitTicketListColumns}
          pagination={ticketListPagination}
          onChange={handlePagination}
          style={{ cursor: 'pointer' }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default MyTickets;
