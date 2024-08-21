'use client';
import style from './sendTicket.module.scss';
import { Button, Divider, Form, Modal, Radio, Spin, Typography } from 'antd';
import {
  useGetParentCategoriesList,
  useGetSubCategoriesList,
  usePostUnitTicketPostSubmit,
  usePostUnitTicketSubmit,
} from '../api/ticket';
import { useGetUserInfo } from '@/app/auth/api/auth';
import { useEffect, useRef, useState } from 'react';

import { RadioCard } from '@/app/_components/radio/radioCard';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { generalMessage, successfulTicketRegister } from '@/lib/alertMessage';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useForm } from 'antd/es/form/Form';
import { MdAttachFile, MdOutlineKeyboardVoice } from 'react-icons/md';
import { SlMicrophone } from 'react-icons/sl';
import { IoStopSharp } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
const { Text, Title } = Typography;
const SendTicket = () => {
  const router = useRouter();
  const [ticketForm] = useForm();
  const refSubCategory = useRef(null);
  const refDesc = useRef(null);
  const { data: getParentCategoriesList, isLoading: loadingGetParentCategory } =
    useGetParentCategoriesList();
  const {
    trigger: getSubCategoriesList,
    isMutating: isLoadingGetSubCategoryList,
  } = useGetSubCategoriesList();
  const { trigger: getUserInfo, isMutating: isLoadingGetUserInfo } =
    useGetUserInfo();
  const { trigger: postUnitTicketSubmit } = usePostUnitTicketSubmit();
  const {
    trigger: postUnitTicketPostSubmit,
    isMutating: postUnitTicketLoading,
  } = usePostUnitTicketPostSubmit();
  const [parentCategoryValue, setParentCategoryValue] = useState('');
  const [subCategoryValue, setsubCategoryValue] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURLModal, setAudioURLModal] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const fetchUserInfo = async () => {
    const { data: userInfo } = await getUserInfo();
    setUserInfo(userInfo);
  };
  const onChangeCategoryList = async (id) => {
    setParentCategoryValue(id);
    setsubCategoryValue('');

    const { data: subCategoriesListResponsed } = await getSubCategoriesList({
      id,
    });

    setSubCategoryList(subCategoriesListResponsed);
    refSubCategory?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onChangeSubCategory = (id) => {
    setsubCategoryValue(id);
    refDesc?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const postTicketHandler = async (values: { message: string }) => {
    const { message } = values;
    const ticketData = {
      unit: userInfo.id,
      categories: [parentCategoryValue, subCategoryValue],
      status: '55c66a81-91fc-4d4c-85c9-00328aacc2eb',
    };

    try {
      const { data: postUnitTicketSubmitResponse } = await postUnitTicketSubmit(
        { data: ticketData },
      );
      const ticketPostData = {
        message,
        ticket: postUnitTicketSubmitResponse.id,
        media: '',
      };

      await postUnitTicketPostSubmit({ data: ticketPostData });
      toast.success(successfulTicketRegister);
      ticketForm.resetFields();
      setTimeout(() => {
        router.push(`/my-ticket/${postUnitTicketSubmitResponse.id}`);
      }, 4000);
    } catch (error) {
      toast.error(generalMessage);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current);
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
  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (isLoadingGetUserInfo || loadingGetParentCategory) {
    return <Spin />;
  }

  return (
    <>
      <ToastComponent />
      <div className={`${style.send_ticket_container}`}>
        <div className={`${style.title_container}`}>
          <Title level={4}>ارسال تیکت</Title>
          <Divider style={{ paddingBottom: 0, marginBottom: 0 }} />
        </div>
        <Form
          form={ticketForm}
          layout="vertical"
          onFinish={postTicketHandler}
          className={`${style.form_container}`}
        >
          <div className={`${style.question_section}`}>
            <Title level={4}>دسته یا دپارتمان</Title>
            <span className={`${style.text}`}>
              مشکل شما در مورد کدام دسته یا دپارتمان است؟{' '}
            </span>
            <Radio.Group
              value={parentCategoryValue}
              className={`${style.radio_container}`}
            >
              {getParentCategoriesList?.data.map(
                (
                  item: {
                    icon: string;
                    name: string;
                    id: string;
                  },
                  index: string | number,
                ) => {
                  return (
                    <RadioCard
                      key={item.id}
                      id={item.id}
                      text={item.name}
                      image={item?.icon ?? '/image/notFound.png'}
                      selected={parentCategoryValue === item.id}
                      onSelect={onChangeCategoryList}
                    />
                  );
                },
              )}
            </Radio.Group>
          </div>
          <div ref={refSubCategory}>
            {subCategoryList.length > 0 &&
              (isLoadingGetSubCategoryList ? (
                <Spin />
              ) : (
                <div className={`${style.question_section}`}>
                  <Title level={4}>انتخاب بخش</Title>

                  <span className={`${style.text}`}>
                    لطفا بخش مربوطه را انتخاب نمایید.
                  </span>
                  <Radio.Group
                    value={subCategoryValue}
                    className={`${style.radio_container}`}
                  >
                    {subCategoryList.map(
                      (
                        item: { name: string; id: string },
                        index: string | number,
                      ) => {
                        return (
                          <RadioCard
                            key={item.id}
                            id={item.id}
                            text={item.name}
                            hasImage={false}
                            selected={subCategoryValue === item.id}
                            onSelect={onChangeSubCategory}
                          />
                        );
                      },
                    )}
                  </Radio.Group>
                </div>
              ))}
          </div>
          <div className={`${style.question_section}`} ref={refDesc}>
            <Title level={4}>توضیحات</Title>
            <div className={`${style.content}`}>
              <Form.Item
                rules={[
                  { required: true, message: 'لطفا این قسمت را خالی نگذارید' },
                ]}
                name="message"
                label="شرح مشکل"
                // required
              >
                <TextArea rows={4} />
              </Form.Item>
              <div className={`${style.attachment_contatiner}`}>
                <div className={`${style.record_container}`}>
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
                      <audio
                        src={audioURL}
                        controls
                        className={`${style.audio}`}
                      />
                      <AiOutlineDelete size={20} color="#ff0033" />
                    </div>
                  )}
                </div>
                <Button
                  className={`${style.btn_attachment}`}
                  icon={<MdAttachFile size={23} />}
                >
                  افزودن ضمیمه
                </Button>
              </div>
            </div>
          </div>

          <Form.Item className={`${style.form_item}`} shouldUpdate>
            {() => {
              const hasTouchedFields = ticketForm.isFieldsTouched();
              const hasErrors =
                ticketForm
                  .getFieldsError()
                  .filter(({ errors }) => errors.length).length > 0;

              return (
                <Button
                  className={`${style.btn}`}
                  type="primary"
                  htmlType="submit"
                  loading={postUnitTicketLoading}
                  disabled={
                    !parentCategoryValue ||
                    !subCategoryValue ||
                    !hasTouchedFields ||
                    hasErrors
                  }
                >
                  ارسال تیکت
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </div>
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
    </>
  );
};

export default SendTicket;
{
  /* <Form.Item>
                <Button onClick={recording ? stopRecording : startRecording}>
                  {recording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                {audioURLModal && <audio src={audioURLModal} controls />}
              </Form.Item> */
}
