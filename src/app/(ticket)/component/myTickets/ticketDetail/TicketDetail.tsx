import {
  useGetTicketTimeline,
  usePostUnitTicketPostSubmit,
  useUnitTicketDetail,
} from '@/app/(ticket)/api/ticket';
import { Button, Card, Divider, Flex, Form, Spin, Tag, Typography } from 'antd';
import moment from 'moment-jalaali';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import style from './ticketDetail.module.scss';
import { GoTag } from 'react-icons/go';
import TextArea from 'antd/es/input/TextArea';
import { toast } from 'react-toastify';
import { successfulTicketRegister } from '@/lib/alertMessage';
import { BiMessageRoundedDots } from 'react-icons/bi';

const { Text, Title } = Typography;
const TicketDetail = () => {
  const { id } = useParams();
  const { trigger: getTicketTimeline, isMutating: getTicketTimelineLoading } =
    useGetTicketTimeline();
  const { trigger: getUnitTicketDetail } = useUnitTicketDetail();
  const {
    trigger: postUnitTicketPostSubmit,
    isMutating: postUnitTicketLoading,
  } = usePostUnitTicketPostSubmit();

  const [timelineList, setTimelineList] = useState([]);
  const [unitTicketDetail, setunitTicketDetail] = useState({});

  const fetchTimelineData = async () => {
    try {
      const { data: unitTicketDetailResponsed } = await getUnitTicketDetail({
        id,
      });
      setunitTicketDetail(unitTicketDetailResponsed);
      const { data: ticketTimelineResponsed } = await getTicketTimeline(id);
      setTimelineList(
        ticketTimelineResponsed.map((item: { timeline: any }) => item.timeline),
      );
    } catch (error) {}
  };

  const handlePostTicket = async (values: { message: string }) => {
    const { message } = values;
    if (!message) return;
    const ticketPostData = {
      message,
      ticket: id,
      media: '',
    };

    try {
      await postUnitTicketPostSubmit({ data: ticketPostData });
      toast.success(successfulTicketRegister);
      fetchTimelineData();
    } catch (error) {}
  };
  useEffect(() => {
    fetchTimelineData();
  }, []);

  if (getTicketTimelineLoading || !timelineList.length) {
    return <Spin />;
  }

  const renderedTimeline = (item: {
    type: string;
    status: { title: string; color: string };
    history_date: string;
    author: {};
  }) => {
    const { type, status, history_date, author } = item;
    switch (type) {
      case 'Ticket':
        return (
          <div className={`${style.timeline_item}`}>
            <div className={`${style.timeline_icon}`}>
              <GoTag size={17} strokeWidth={1.5} color="#757575" />
            </div>
            <div className={`${style.timeline_content}`}>
              <Flex gap={'10px'}>
                <Tag color={status?.color}>{status?.title}</Tag>
                <Text type="secondary">
                  {moment(history_date).format('jYYYY/jM/jD ساعت HH:mm')}
                </Text>
              </Flex>
            </div>
          </div>
        );
      case 'TicketPost':
        return (
          <div className={`${style.timeline_item}`}>
            <Card
              style={{ padding: 0 }}
              styles={{ body: { padding: '0' } }}
              className={`${style.timeline_content}`}
            >
              <div className={`${style.content_card}`}>
                <div className={`${style.header_card}`}>
                  <div>
                    {' '}
                    <BiMessageRoundedDots color="#757575" size={30} />
                    <Text style={{ fontWeight: 600 }}>
                      {' '}
                      توسط {author?.first_name} {` `} {author?.last_name}
                      {` `}
                    </Text>
                  </div>
                  <div className={`${style.info_date}`}>
                    {' '}
                    <Text type="secondary">
                      {'   '}
                      {moment(history_date).format('jYYYY/jM/jD ساعت HH:mm')}
                    </Text>
                  </div>
                </div>
                <Divider style={{ padding: 0, margin: 0 }} />
                <div className={`${style.comment_card}`}>
                  <Text> {item?.message}</Text>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const { categories, unit, status, created_at } = unitTicketDetail;
  return (
    <div className={`${style.ticket_detail_container}`}>
      <div className={`${style.title_container}`}>
        <Title level={4}>{categories[0].name}</Title>
        <Title type="secondary" level={5}>
          ایراد {categories[1].name}
        </Title>
        <div className={`${style.title_detail_container}`}>
          <Tag style={{ maxWidth: 'max-content' }} color={status?.color}>
            {status?.title}
          </Tag>
          <Text type="secondary">
            توسط{` `}
            {unit?.first_name}
            {` `}
            {unit?.last_name}
          </Text>
          <Text type="secondary">
            {moment(created_at).format('jYYYY/jM/jD ساعت HH:mm')}
          </Text>
        </div>
      </div>
      <Divider style={{ margin: 0, padding: 0 }} />
      <div className={`${style.timeline}`}>
        {timelineList.map((item) => renderedTimeline(item))}
      </div>
      <Form
        layout="vertical"
        onFinish={handlePostTicket}
        className={`${style.message_form}`}
      >
        <Form.Item label="متن پیام" name={'message'}>
          <TextArea rows={5} placeholder="متن پیام را وارد کنید" />
        </Form.Item>
        <Form.Item>
          <div className={`${style.form_item_message}`}>
            <Button
              type="primary"
              className={`${style.btn}`}
              loading={postUnitTicketLoading}
              htmlType="submit"
            >
              ارسال پیام
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default TicketDetail;
