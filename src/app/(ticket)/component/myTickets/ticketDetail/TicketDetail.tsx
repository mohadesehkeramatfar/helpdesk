import {
  useGetTicketTimeline,
  usePatchTicketPostAdd,
  usePostUnitTicketPostSubmit,
  useUnitTicketDetail,
} from '@/app/(ticket)/api/ticket';
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Modal,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import moment from 'moment-jalaali';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import style from './ticketDetail.module.scss';
import TextArea from 'antd/es/input/TextArea';
import useResponsive from '@/lib/hook/useResponsive';
import { BiMessageRoundedDots } from 'react-icons/bi';
import Link from 'next/link';
import { MdAttachFile, MdOutlineKeyboardVoice } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoStopSharp } from 'react-icons/io5';
import { SlMicrophone } from 'react-icons/sl';
import { useForm } from 'antd/es/form/Form';

const { Text, Title } = Typography;
const TicketDetail = () => {
  const { id } = useParams();
  const [ticketForm] = useForm();
  const { isMobile } = useResponsive();
  const { trigger: getTicketTimeline, isMutating: getTicketTimelineLoading } =
    useGetTicketTimeline();
  const { trigger: getUnitTicketDetail } = useUnitTicketDetail();
  const {
    trigger: postUnitTicketPostSubmit,
    isMutating: postUnitTicketLoading,
  } = usePostUnitTicketPostSubmit();
  const { trigger: patchTicketPostAdd } = usePatchTicketPostAdd();
  const [audioBlobFile, setAudioBlobFile] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURLModal, setAudioURLModal] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [fileList, setFileList] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [timelineList, setTimelineList] = useState([]);
  const [unitTicketDetail, setUnitTicketDetail] = useState({});
  const [newMessageLoading, setNewMessageLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [testLoading, setTestLoading] = useState(true);
  const offsetRef = useRef(offset);
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/weba' });
        setAudioBlobFile(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURLModal(audioUrl);

        audioChunks.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    });
  };
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };
  const handleSendRecord = () => {
    setShowRecordModal(false);
    setAudioURL(audioURLModal);
  };
  const handleCancelRecord = () => {
    setShowRecordModal(false);
    setAudioURLModal('');
  };

  const uploadHandler = (e) => {
    const currentFile = e.file;
    const currentFileList = e.fileList;

    const filteredList = currentFileList.filter(
      (item) => !removedFiles.some((removed) => removed.uid === item.uid),
    );
    setFileList(filteredList);
  };
  const handleDeleteFile = (file) => {
    setRemovedFiles((prev) => [...prev, file]);
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
  };
  const [isFetching, setIsFetching] = useState(false);
  const fetchTimelineData = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const { data: unitTicketDetailResponsed } = await getUnitTicketDetail({
        id,
      });
      const limit = 40;
      setUnitTicketDetail(unitTicketDetailResponsed);
      const { data: ticketTimelineResponsed } = await getTicketTimeline(
        `${id}?limit=${limit}`,
      );
      setTimelineList(ticketTimelineResponsed.results);
      setTestLoading(false);
      // setTimelineList((prev) => {
      //   const newItems = ticketTimelineResponsed.results.filter(
      //     (item) => !prev.some((prevItem) => prevItem.id === item.id)
      //   );
      //   return [...prev, ...newItems];
      // });

      // setTimelineList((prev) => [...prev, ticketTimelineResponsed.results]);

      // if (ticketTimelineResponsed.results.length === limit) {
      //   offsetRef.current += limit;
      //   setOffset(offsetRef.current);
      // } else setHasMore(false);
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const handlePostTicket = async (values: { message: string }) => {
    setNewMessageLoading(true);
    const { message } = values;
    const ticketPostData = {
      message,
      ticket: id,
      // media: '',
    };
    try {
      const { data: postUnitTicketPostSubmitResponsed } =
        await postUnitTicketPostSubmit({ data: ticketPostData });

      if (audioBlobFile && audioURL)
        handleAudioUpload(postUnitTicketPostSubmitResponsed.id);
      if (fileList.length > 0)
        handleFileUploads(postUnitTicketPostSubmitResponsed.id);

      await fetchTimelineData();
      ticketForm.resetFields();
    } catch (error) {
    } finally {
      setNewMessageLoading(false);
    }
  };
  const handleAudioUpload = async (postId: string) => {
    const audioFile = new File([audioBlobFile], `recording${new Date()}.wav`, {
      type: 'audio/wav',
    });
    const formData = new FormData();
    formData.append('file', audioFile);
    await patchTicketPostAdd({ id: postId, data: formData });
    setAudioURL('');
    await fetchTimelineData();
  };
  const handleFileUploads = async (postId: string) => {
    await Promise.all(
      fileList.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj);
        await patchTicketPostAdd({ id: postId, data: formData });
      }),
    );
    await fetchTimelineData();
    setFileList([]);
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  if (testLoading) {
    return <Spin />;
  }

  let picNumber = 1;
  const { categories, unit, status, created_at } = unitTicketDetail;

  return (
    <div className={`${style.ticket_detail_container}`}>
      {/* TITLE CONTAINER */}
      <div className={`${style.title_container}`}>
        <Title level={4}>{categories[1].name}</Title>
        <Title type="secondary" level={5}>
          ایراد {categories[0].name}
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
        <Divider style={{ margin: 0, padding: 0 }} />
      </div>

      {/* TIMELINE */}
      <div className={`${style.timeline}`}>
        {/* <InfiniteScroll
          dataLength={timelineList.length}
          next={fetchTimelineData}
          hasMore={hasMore}
          loader={<Spin />}
          // endMessage={<p>No more data to load</p>}
        > */}
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
                  <Flex
                    style={{ padding: '10px' }}
                    gap={'10px'}
                    vertical={false}
                  >
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
                  <Flex
                    style={{ padding: '10px' }}
                    gap={'10px'}
                    vertical={false}
                  >
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

      <Divider style={{ margin: 0, padding: 0 }} />

      {/* REPLY FORM */}
      <Form
        form={ticketForm}
        layout="vertical"
        onFinish={handlePostTicket}
        className={`${style.message_form}`}
      >
        <Title level={4}>ارسال پاسخ</Title>
        <Form.Item
          rules={[
            {
              required: !audioURL ? true : false,
              message: 'لطفا این قسمت را خالی نگذارید',
            },
          ]}
          label="پاسخ"
          name={'message'}
        >
          <TextArea rows={5} placeholder="پاسخ خود را وارد کنید" />
        </Form.Item>
        <div className={`${style.attachment_contatiner}`}>
          <div className={`${style.upload_record_container}`}>
            <Button
              onClick={() => {
                setShowRecordModal(!showRecordModal);
                setAudioURLModal('');
                setRecording(false);
              }}
              icon={<MdOutlineKeyboardVoice size={23} />}
            >
              ارسال تیکت صوتی
            </Button>
            {audioURL && (
              <div className={`${style.file_container}`}>
                <audio src={audioURL} controls className={`${style.audio}`} />
                <Button
                  type="text"
                  onClick={() => {
                    setAudioURL('');
                    setAudioBlobFile('');
                  }}
                  icon={<AiOutlineDelete size={18} color="#ff0033" />}
                />
              </div>
            )}
          </div>
          <div className={`${style.upload_file_container}`}>
            <Upload
              accept=".png ,.jpeg,.jpg,.pdf "
              multiple={true}
              onChange={uploadHandler}
              showUploadList={false}
              fileList={fileList}
            >
              <Button icon={<MdAttachFile size={23} />}>افزودن ضمیمه</Button>
            </Upload>
            <div className={`${style.file_list_container}`}>
              {fileList.map((file, index) => (
                <div key={index} className={`${style.file_container}`}>
                  <span className={`${style.file_name}`}>{file.name}</span>
                  <Button
                    onClick={() => handleDeleteFile(file)}
                    type="text"
                    icon={<AiOutlineDelete size={18} color="#ff0033" />}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Form.Item shouldUpdate>
          {() => {
            const hasTouchedFields = ticketForm.isFieldsTouched();
            const hasErrors =
              ticketForm.getFieldsError().filter(({ errors }) => errors.length)
                .length > 0;

            return (
              <div className={`${style.form_item_message}`}>
                <Button
                  className={`${style.btn}`}
                  type="primary"
                  htmlType="submit"
                  loading={postUnitTicketLoading || newMessageLoading}
                  disabled={(!hasTouchedFields || hasErrors) && !audioURL}
                >
                  ارسال پاسخ
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Form>

      {showRecordModal && (
        <Modal
          open={showRecordModal}
          title="ضبط صدا"
          footer={[
            <Button key="cancel" onClick={handleCancelRecord}>
              انصراف
            </Button>,
            audioURLModal && (
              <Button key="ok" type="primary" onClick={handleSendRecord}>
                تایید
              </Button>
            ),
          ]}
        >
          <div className={`${style.content_modal}`}>
            <Text>برای ضبط صدای خود روی دکمه زیر کلیک کنید</Text>
            <Button
              className={`${style.btn_record}`}
              type="text"
              onClick={recording ? stopRecording : startRecording}
              icon={
                recording ? (
                  <IoStopSharp color="#ff0033" size={50} />
                ) : (
                  <SlMicrophone color="#0098a9" size={50} />
                )
              }
            ></Button>
            {recording && (
              <Text style={{ textAlign: 'center' }} type="secondary">
                در حال ضبط صدا
              </Text>
            )}
            {audioURLModal && (
              <audio
                className={`${style.audio}`}
                src={audioURLModal}
                controls
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
export default TicketDetail;

// const renderedTimeline = (item: {
//   type: string;
//   status: { title: string; color: string };
//   history_date: string;
//   author: {};
// }) => {
//   const { type, status, history_date, author, history_user } = item;
//   switch (type) {
//     case 'Ticket':
//       return (
//         <div className={`${style.timeline_item}`}>
//           <div className={`${style.timeline_icon}`}>
//             <GoTag size={17} strokeWidth={1.5} color="#757575" />
//           </div>

//           <Flex
//             {...(isMobile ? { vertical: true } : { vertical: false })}
//             gap={'5px'}
//             style={{ padding: ' 4px 10px' }}
//           >
//             <Flex gap={'10px'}>
//               <Text type="secondary">تغییر وضعیت</Text>
//               <Tag color={status?.color}>{status?.title}</Tag>
//             </Flex>
//             <Flex gap={'10px'}>
//               <Text type="secondary">
//                 توسط {history_user.first_name}
//                 {` `}
//                 {history_user.last_name}
//               </Text>
//               <Divider
//                 type="vertical"
//                 style={{ height: '25px', border: '1px solid #eeeeee' }}
//               />
//               <div>
//                 <Text type="secondary">
//                   {moment(history_date).format('jYYYY/jM/jD')}
//                 </Text>
//                 <Text type="secondary">---</Text>
//                 <Text type="secondary">
//                   {moment(history_date).format('HH:mm')}
//                 </Text>
//               </div>
//             </Flex>
//           </Flex>
//         </div>
//         // </div>
//       );
//     case 'TicketPost':
//       return (
//         <div className={`${style.timeline_item}`}>
//           <Card
//             style={{ padding: 0, border: '1px solid #eee' }}
//             styles={{ body: { padding: '0' } }}
//             className={`${style.timeline_content}`}
//           >
//             <div className={`${style.content_card}`}>
//               <div className={`${style.header_card}`}>
//                 <div className={`${style.user_info}`}>
//                   <BiMessageRoundedDots color="#757575" size={26} />
//                   <Text style={{ fontWeight: 600 }}>
//                     توسط {author?.first_name} {` `} {author?.last_name}
//                   </Text>
//                 </div>
//                 <Divider
//                   type="vertical"
//                   style={{ height: '25px', border: '1px solid #eeeeee' }}
//                 />
//                 <div className={`${style.date_info}`}>
//                   <Text type="secondary">
//                     {'   '}
//                     {moment(history_date).format('jYYYY/jM/jD ')}
//                   </Text>
//                   <Text type="secondary">---</Text>
//                   <Text type="secondary">
//                     {'   '}
//                     {moment(history_date).format('HH:mm')}
//                   </Text>
//                 </div>
//               </div>
//               <Divider style={{ padding: 0, margin: 0 }} />
//               <div className={`${style.comment_card}`}>
//                 <Text> {item?.message}</Text>
//               </div>
//             </div>
//           </Card>
//         </div>
//       );

//     default:
//       return null;
//   }
// };
