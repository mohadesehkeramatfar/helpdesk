import {
  Button,
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
import { FcProcess } from 'react-icons/fc';
import Title from 'antd/es/typography/Title';
const { Text } = Typography;

const statisticData = [
  {
    color: 'default',
    icon: <AiOutlineRise size={40} />,
    title: 'کل',
    value: 0,
  },
  {
    color: 'processing',
    icon: <FcProcess size={40} color="#1677ff" />,
    title: 'در حال بررسی',
    value: 0,
  },
  {
    color: 'success',
    icon: <IoCheckmarkOutline size={40} />,
    title: 'بسته',
    value: 0,
  },
];
const MyTickets = () => {
  const router = useRouter();
  const { data: getUnitTicketList, isLoading: getUnitTicketListLoading } =
    useGetUnitTicketList();
  const [ticketListPagination, setTicketListPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 50,
  });

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
            <Text>{categories[0]?.parent.name}</Text>
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
      <div>
        <Title level={3}>درخواست‌های من</Title>
        <Divider style={{ paddingBottom: 0, marginBottom: 0 }} />
      </div>
      <div className={`${style.statistics_container}`}>
        {statisticData.map((item, index) => (
          <div key={index} className={`${style.statistic}`}>
            <Tag color={item.color} className={style.tag}>
              {item.icon}
            </Tag>
            <Statistic title={item.title} value={item.value} />
          </div>
        ))}
      </div>

      <Table
        dataSource={unitTicketList}
        columns={unitTicketListColumns}
        pagination={ticketListPagination}
        onChange={handlePagination}
        rowClassName={() => globalStyle.customRowHeight}
      />
    </div>
  );
};

export default MyTickets;
