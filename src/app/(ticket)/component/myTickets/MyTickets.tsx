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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useResponsive from '@/lib/hook/useResponsive';
import { CgDetailsMore } from 'react-icons/cg';
const { Text, Title } = Typography;

const MyTickets = () => {
  const router = useRouter();
  const { data: getUnitTicketList, isLoading: getUnitTicketListLoading } =
    useGetUnitTicketList();
  const {
    data: getTicketStatusTagReport,
    isLoading: ticketStatusTagReportLoading,
  } = useGetTicketStatusTagReport();
  const { isMobile } = useResponsive();
  const [ticketListPagination, setTicketListPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 50,
  });
  const handlePagination = (page: { current: number }) => {
    const { current } = page;
    setTicketListPagination({ ...ticketListPagination, current });
  };

  if (
    getUnitTicketListLoading ||
    !getUnitTicketList ||
    ticketStatusTagReportLoading
  ) {
    return <Spin />;
  }
  const unitTicketListColumns = [
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
            <Text>{categories[0]?.parent?.name}</Text>
            <Text type="secondary">{categories[0]?.name}</Text>
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
  const { data: resultOfgetTicketStatusTagReport } = getTicketStatusTagReport;

  return (
    <div className={`${style.my_ticket_container}`}>
      {/* TITLE CONTAINER */}
      <div className={`${style.title_container}`}>
        <Title level={4}>تیکت‌های من</Title>
        <div className={`${style.statistics_container}`}>
          {resultOfgetTicketStatusTagReport.map(
            (item: { title: string; id: string }) => (
              <Statistic
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                title={<Text>{item.title}</Text>}
                value={item.ticket_count}
                // valueStyle={{ color: item.color }}
              />
            ),
          )}
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
