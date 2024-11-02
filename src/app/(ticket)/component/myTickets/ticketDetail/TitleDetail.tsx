import { Divider, Flex, Tag, Typography } from 'antd';
import style from './ticketDetail.module.scss';
import moment from 'moment-jalaali';

const { Title, Text } = Typography;
const TitleDetail = ({ unitTicketDetail }) => {
  const { categories, user, status, created_at, visit_interval, ref_code } =
    unitTicketDetail;

  return (
    <div className={`${style.title_container}`}>
      <Flex align="center" gap={5}>
        <Title level={4}>{ref_code}-</Title>
        <Title level={4}>{categories[0].name}</Title>
      </Flex>
      <Title type="secondary" level={5}>
        ایراد {categories[1].name}
      </Title>
      <div className={`${style.title_detail_container}`}>
        <Tag style={{ maxWidth: 'max-content' }} color={status?.color}>
          {status?.title}
        </Tag>
        <Text type="secondary">
          توسط{` `}
          {user?.first_name}
          {` `}
          {user?.last_name}
        </Text>
        <Text type="secondary">
          {moment(created_at).format('jYYYY/jM/jD ساعت HH:mm')}
        </Text>
      </div>
      <Flex gap={'10px'}>
        <Text>زمان پیشنهادی مراجعه</Text>
        <Text>{visit_interval.date}</Text>

        <Text>
          ساعت {visit_interval.start_time.split(':')[0]}:
          {visit_interval.start_time.split(':')[1]}
          {` `} تا {` `}
          {visit_interval.end_time.split(':')[0]}:
          {visit_interval.end_time.split(':')[1]}
        </Text>
      </Flex>
      <Divider style={{ margin: 0, padding: 0 }} />
    </div>
  );
};

export default TitleDetail;
