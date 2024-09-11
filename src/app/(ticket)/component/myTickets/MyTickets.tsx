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
import { useGetUnitTicketList } from '../../api/ticket';
import style from './myTicket.module.scss';
import globalStyle from '@/app/layout.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineRise } from 'react-icons/ai';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { PiArrowsCounterClockwiseThin } from 'react-icons/pi';
import useResponsive from '@/lib/hook/useResponsive';
import { CgDetailsMore } from 'react-icons/cg';
const { Text, Title } = Typography;

const MyTickets = () => {
  const router = useRouter();
  const { data: getUnitTicketList, isLoading: getUnitTicketListLoading } =
    useGetUnitTicketList();
  const { isMobile } = useResponsive();
  const [ticketListPagination, setTicketListPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 50,
  });
  const statisticData = [
    {
      color: '#f6a22a',
      icon: <AiOutlineRise size={isMobile ? 20 : 40} />,
      title: 'کل',
      value: 0,
    },
    {
      color: '#009bff',
      icon: (
        <PiArrowsCounterClockwiseThin
          size={isMobile ? 20 : 40}
          color="#1677ff"
        />
      ),
      title: 'در حال بررسی',
      value: 0,
    },
    {
      color: '#5cb85c',
      icon: <IoCheckmarkOutline size={isMobile ? 20 : 40} />,
      title: 'بسته',
      value: 0,
    },
  ];
  const handlePagination = (page: { current: number }) => {
    const { current } = page;
    setTicketListPagination({ ...ticketListPagination, current });
  };

  if (getUnitTicketListLoading || !getUnitTicketList) {
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

  return (
    <div className={`${style.my_ticket_container}`}>
      {/* TITLE CONTAINER */}
      <div className={`${style.title_container}`}>
        <Title level={4}>تیکت‌های من</Title>
        <div className={`${style.statistics_container}`}>
          {statisticData.map((item, index) => (
            <Statistic
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              title={<Text>{item.title}</Text>}
              value={150}
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
