import {
  Button,
  Card,
  Divider,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import moment from 'moment-jalaali';
import { useGetUnitTicketList } from '../../api/ticket';
import style from './myTicket.module.scss';
import globalStyle from '../../../layout.module.scss';
import { useState } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { AiOutlineRise } from 'react-icons/ai';
import { IoCheckmarkOutline } from 'react-icons/io5';
import Title from 'antd/es/typography/Title';
import { PiArrowsCounterClockwiseThin } from 'react-icons/pi';
import useResponsive from '@/lib/hook/useResponsive';
const { Text } = Typography;

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
      color: '#9e9e9e',
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
          <Space direction="vertical">
            {' '}
            <Text>{categories[0]?.parent?.name}</Text>
            <Text type="secondary">{categories[0]?.name}</Text>
          </Space>
        );
      },
    },
    {
      title: 'تاریخ ثبت',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: { updated_at: string }[]) => {
        return (
          <Space direction="vertical">
            {' '}
            <Text>
              {moment(categories[1]?.updated_at).format('jYYYY/jM/jD') + '?'}
            </Text>
            <Text type="secondary">ساعت</Text>
          </Space>
        );
      },
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="success">success</Tag>,
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
              icon={
                <TbListDetails
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
      <div className={`${style.title_container}`}>
        <Title level={4}>تیکت‌های من</Title>
        <Divider style={{ paddingBottom: 0, marginBottom: 0 }} />
      </div>
      <div className={`${style.statistics_container}`}>
        {statisticData.map((item, index) => (
          // <div key={index} className={`${style.statistic}`}>
          <Card key={index} bordered={false}>
            <Statistic
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              title={
                <span style={{ color: item.color, fontWeight: 700 }}>
                  {item.title}
                </span>
              }
              value={item.value}
              valueStyle={{ color: item.color }}
              // prefix={item.icon}
            />
          </Card>
        ))}
      </div>
      <div className={`${style.table_container}`}>
        <Table
          onRow={(record) => ({
            onClick: () => router.push(`/my-ticket/${record.id}`),
          })}
          dataSource={unitTicketList}
          columns={unitTicketListColumns}
          pagination={ticketListPagination}
          onChange={handlePagination}
          rowClassName={() => globalStyle.customRowHeight}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default MyTickets;
// </div>
// <div key={index} className={`${style.statistic}`}>
//   {/* <Tag color={item.color} className={style.tag}> */}
//   {isMobile ? null : item.icon}
//   {/* </Tag> */}
//   <Statistic title={item.title} value={item.value} />
// </div>
