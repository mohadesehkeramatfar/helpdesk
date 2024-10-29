import { Card, Divider, Flex, Typography } from 'antd';
import { BiMessageRoundedDots } from 'react-icons/bi';
import style from './ticketDetail.module.scss';
import moment from 'moment-jalaali';
import Link from 'next/link';
import { MdAttachFile } from 'react-icons/md';

const { Text } = Typography;

const TimeLine = ({ timelineList }) => {
  let picNumber = 1;

  return (
    <div className={`${style.timeline}`}>
      {timelineList.map((item) => {
        return (
          <div key={item.id} className={`${style.timeline_item}`}>
            <Card
              style={{ padding: 0, border: '1px solid #eee' }}
              styles={{ body: { padding: '0' } }}
              className={`${style.timeline_content}`}
            >
              <div className={`${style.content_card}`}>
                <div className={`${style.header_card}`}>
                  <div className={`${style.user_info}`}>
                    <BiMessageRoundedDots color="#757575" size={26} />
                    <Text style={{ fontWeight: 600 }}>
                      توسط {item?.author?.first_name} {` `}{' '}
                      {item?.author?.last_name}
                    </Text>
                  </div>
                  <Divider
                    type="vertical"
                    style={{ height: '25px', border: '1px solid #eeeeee' }}
                  />
                  <Flex
                    gap={'3px'}
                    vertical={false}
                    className={`${style.date_info}`}
                  >
                    <Text type="secondary">
                      {moment(item?.created_at).format('jYYYY/jM/jD ')}
                    </Text>

                    <Text type="secondary"> -- </Text>
                    <Text type="secondary">
                      {moment(item?.created_at).format('HH:mm')}
                    </Text>
                  </Flex>
                </div>
                <Divider style={{ padding: 0, margin: 0 }} />

                <div className={`${style.comment_card}`}>
                  {item?.message ? (
                    <Text>{item.message}</Text>
                  ) : (
                    <Text type="secondary">پیام صوتی</Text>
                  )}
                </div>

                <Divider style={{ padding: 0, margin: 0 }} />
                <Flex style={{ padding: '10px' }} gap={'10px'} vertical={false}>
                  {item?.media?.assets.map(
                    (asset: { asset_type: { name: string }; file: any }) => {
                      return asset.asset_type.name === 'picture' ? (
                        <Link
                          key={asset.id}
                          style={{ color: '#0098a9' }}
                          target="_blank"
                          href={`${asset.file}`}
                        >
                          <Flex vertical={false}>
                            <MdAttachFile size={18} />
                            تصویر {picNumber++}
                          </Flex>
                        </Link>
                      ) : null;
                    },
                  )}
                </Flex>
                <Flex style={{ padding: '10px' }} gap={'10px'} vertical={false}>
                  {item?.media?.assets.map(
                    (asset: { asset_type: { name: string }; file: any }) => {
                      return asset.asset_type.name === 'audio' ? (
                        <audio key={asset.id} controls src={asset.file} />
                      ) : null;
                    },
                  )}
                </Flex>
              </div>
            </Card>
          </div>
        );
      })}
      {/* </InfiniteScroll> */}
    </div>
  );
};
export default TimeLine;
