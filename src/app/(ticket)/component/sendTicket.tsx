'use client';
import style from './sendTicket.module.scss';
import {
  Button,
  Divider,
  Flex,
  Form,
  Modal,
  Radio,
  Spin,
  Typography,
  Upload,
} from 'antd';
import {
  useDeletePostTicket,
  useDeleteTicket,
  useGetParentCategoriesList,
  useGetSubCategoriesList,
  usePatchTicketPostAdd,
  usePostUnitTicketPostSubmit,
  usePostUnitTicketSubmit,
} from '../api/ticket';
import { useGetUserInfo } from '@/app/auth/api/auth';
import { useEffect, useRef, useState } from 'react';

import { RadioCard } from '@/app/_components/radio/radioCard';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useForm } from 'antd/es/form/Form';
import { MdAttachFile, MdOutlineKeyboardVoice } from 'react-icons/md';
import { SlMicrophone } from 'react-icons/sl';
import { IoStopSharp } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import {
  failedUpload,
  generalMessage,
  successfulTicketRegister,
} from '@/lib/alertMessage';
import useResponsive from '@/lib/hook/useResponsive';
const { Text, Title } = Typography;
const SendTicket = () => {
  const router = useRouter();
  const [ticketForm] = useForm();
  const refSubCategory = useRef(null);
  const refDesc = useRef(null);
  const {
    trigger: getParentCategoriesList,
    isMutating: loadingGetParentCategory,
  } = useGetParentCategoriesList();
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
  const { trigger: patchTicketPostAdd } = usePatchTicketPostAdd();
  const { trigger: deletePostTicket } = useDeletePostTicket();
  const { trigger: deleteTicket } = useDeleteTicket();
  const { isMobile } = useResponsive();
  const [categoryList, setCategoryList] = useState([]);
  const [parentCategoryValue, setParentCategoryValue] = useState('');
  const [subCategoryValue, setsubCategoryValue] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [audioBlobFile, setAudioBlobFile] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURLModal, setAudioURLModal] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [fileList, setFileList] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeList, setSelectedTimeList] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const { data: userInfo } = await getUserInfo();
      setUserInfo(userInfo);
    } catch (error) {
      toast.error(generalMessage);
    }
  };
  const fetchParentCategory = async () => {
    try {
      const { data: parentCategoriesList } = await getParentCategoriesList();
      setCategoryList(parentCategoriesList);
    } catch (error) {
      toast.error(generalMessage);
    }
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
  const deleteFiles = async (ticketPostId: string, ticketId: string) => {
    await deletePostTicket(ticketPostId);
    await deleteTicket(ticketId);
    toast.error(failedUpload);
    // setTimeout(() => window.location.reload(), 5000);
  };
  const successTicket = (postTicketId: string) => {
    toast.success(successfulTicketRegister);
    ticketForm.resetFields();
    setTimeout(() => {
      router.push(`/my-ticket/${postTicketId}`);
    }, 4000);
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
        // media: '',
      };
      const { data: postUnitTicketPostSubmitResponsed } =
        await postUnitTicketPostSubmit({ data: ticketPostData });
      if (audioBlobFile && audioURL && fileList.length > 0) {
        const audioFile = new File(
          [audioBlobFile],
          `recording${new Date()}.wav`,
          {
            type: 'audio/wav',
          },
        );

        const formData = new FormData();
        formData.append('file', audioFile);

        try {
          fileList.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file?.originFileObj);
            await patchTicketPostAdd({
              id: postUnitTicketPostSubmitResponsed.id,
              data: formData,
            });
            setFileList([]);
          });
          await patchTicketPostAdd({
            id: postUnitTicketPostSubmitResponsed.id,
            data: formData,
          });
          setAudioURL('');

          successTicket(postUnitTicketSubmitResponse.id);
        } catch (error) {
          console.log('Sss');

          deleteFiles(
            postUnitTicketPostSubmitResponsed.id,
            postUnitTicketSubmitResponse.id,
          );
        }

        return;
      }
      if (audioBlobFile && audioURL) {
        const audioFile = new File(
          [audioBlobFile],
          `recording${new Date()}.wav`,
          {
            type: 'audio/wav',
          },
        );

        const formData = new FormData();
        formData.append('file', audioFile);

        try {
          await patchTicketPostAdd({
            id: postUnitTicketPostSubmitResponsed.id,
            data: formData,
          });
          setAudioURL('');
          successTicket(postUnitTicketSubmitResponse.id);
        } catch (error) {
          deleteFiles(
            postUnitTicketPostSubmitResponsed.id,
            postUnitTicketSubmitResponse.id,
          );
        }
      }

      if (fileList.length > 0) {
        fileList.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file?.originFileObj);
          try {
            await patchTicketPostAdd({
              id: postUnitTicketPostSubmitResponsed.id,
              data: formData,
            });
            setFileList([]);
          } catch (error) {
            deleteFiles(
              postUnitTicketPostSubmitResponsed.id,
              postUnitTicketSubmitResponse.id,
            );
          }
        });
        successTicket(postUnitTicketSubmitResponse.id);
      }
      if (!fileList.length && !audioURL) {
        successTicket(postUnitTicketSubmitResponse.id);
      }
    } catch (error) {}
  };

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
    setRemovedFiles((prev) => [...prev, file]); // فایل حذف‌شده را به لیست حذف‌ها اضافه کن
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));

    // const filteredFile = fileList.filter((item) => item.uid !== file.uid);
    // setFileList(filteredFile);
  };
  useEffect(() => {
    fetchUserInfo();
    fetchParentCategory();
  }, []);

  if (isLoadingGetUserInfo || loadingGetParentCategory) {
    return <Spin />;
  }

  const dateListTest = [
    {
      id: '1',
      day: 'شنبه',
      date: '1 / 1',
      disabled: false,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: false },
        { id: '2', title: 'ساعت 11-13', disabled: true },
        { id: '3', title: 'ساعت 14-16', disabled: true },
        { id: '4', title: 'ساعت 16-18', disabled: false },
      ],
    },
    {
      id: '2',
      day: 'یکشنبه',
      date: '1 / 2',
      disabled: false,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: false },
        { id: '2', title: 'ساعت 11-13', disabled: false },
        { id: '3', title: 'ساعت 14-16', disabled: false },
        { id: '4', title: 'ساعت 16-18', disabled: false },
      ],
    },
    {
      id: '3',
      day: 'دوشنبه',
      date: '1 / 1',
      disabled: true,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: true },
        { id: '2', title: 'ساعت 11-13', disabled: true },
        { id: '3', title: 'ساعت 14-16', disabled: false },
        { id: '4', title: 'ساعت 16-18', disabled: true },
      ],
    },
    {
      id: '4',
      day: 'سه شنبه',
      date: '1 / 1',
      disabled: false,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: false },
        { id: '2', title: 'ساعت 11-13', disabled: true },
        { id: '3', title: 'ساعت 14-16', disabled: true },
        { id: '4', title: 'ساعت 16-18', disabled: true },
      ],
    },
    {
      id: '5',
      day: 'چهارشنبه',
      date: '1 / 1',
      disabled: false,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: true },
        { id: '2', title: 'ساعت 11-13', disabled: true },
        { id: '3', title: 'ساعت 14-16', disabled: true },
        { id: '4', title: 'ساعت 16-18', disabled: true },
      ],
    },
    {
      id: '6',
      day: 'پنج شنبه',
      date: '1 / 1',
      disabled: true,
      timeList: [
        { id: '1', title: 'ساعت 9-11', disabled: true },
        { id: '2', title: 'ساعت 11-13', disabled: true },
        { id: '3', title: 'ساعت 14-16', disabled: true },
        { id: '4', title: 'ساعت 16-18', disabled: true },
      ],
    },
  ];

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
          {/* PARENT CATEGORY */}
          <div className={`${style.question_section}`}>
            <Title level={4}>دسته یا دپارتمان</Title>
            <span className={`${style.text}`}>
              مشکل شما در مورد کدام دسته یا دپارتمان است؟{' '}
            </span>
            <Radio.Group
              value={parentCategoryValue}
              className={`${style.radio_container}`}
            >
              {categoryList.map(
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

          {/* SUBCATEGORY */}
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
          {/* MESSAGES AND ATTACHMENT */}
          <div className={`${style.question_section}`} ref={refDesc}>
            <Title level={4}>توضیحات</Title>

            <div className={`${style.message_content}`}>
              <Form.Item
                rules={[
                  {
                    required: !audioURL && true,
                    message: 'لطفا این قسمت را خالی نگذارید',
                  },
                ]}
                name="message"
                label="شرح مشکل"
                // required
              >
                <TextArea rows={4} />
              </Form.Item>

              <div className={`${style.attachment_contatiner}`}>
                <div className={`${style.upload_record_container}`}>
                  <Button
                    className={`${style.btn_attachment}`}
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
                        controlsList="nodownload"
                        className={`${style.audio}`}
                      />
                      <Button
                        type="text"
                        onClick={() => {
                          setAudioURL('');
                          setAudioBlobFile('');
                        }}
                        icon={<AiOutlineDelete size={18} color="#ff0033" />}
                      ></Button>
                      {/*  */}
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
                    <Button icon={<MdAttachFile size={23} />}>
                      افزودن ضمیمه
                    </Button>
                  </Upload>
                  <div className={`${style.file_list_container}`}>
                    {fileList.map((file, index) => (
                      <div key={index} className={`${style.file_container}`}>
                        <span className={`${style.file_name}`}>
                          {file.name}
                        </span>
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
            </div>
          </div>

          {/* REFERRAL TIME */}
          <div className={`${style.referral_time_container}`}>
            <Flex vertical={true} gap={'5px'}>
              {' '}
              <Title level={4}>زمان مراجعه</Title>
              <Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
                زمان مراجعه کارشناسان به واحد شما ممکن است بدلیل تأمین قطعات یا
                هماهنگی با سایر دپارتمان‌ها، با زمان پیشنهادی شما اختلاف داشته
                باشد.
              </Text>
            </Flex>
            <div className={`${style.date_card_container}`}>
              {dateListTest.map((item, index) => (
                <Button
                  disabled={item.disabled}
                  key={index}
                  style={{ padding: '30px 15px', minWidth: '100px' }}
                  className={`${style.date_card}  ${selectedDay === item.id ? style.selected : ''}`}
                  onClick={() => {
                    setSelectedDay(item.id);
                    setSelectedTimeList(item.timeList);
                  }}
                >
                  <Title level={5}>{item.day}</Title>
                  <Text type="secondary">{item.date}</Text>
                </Button>
              ))}
            </div>
            <Divider style={{ margin: 0, padding: 0 }} />

            {selectedTimeList?.length > 0 && (
              <Radio.Group className={`${style.time_container}`}>
                {selectedTimeList.map((time) => (
                  <>
                    <Radio
                      disabled={time.disabled}
                      key={time.id}
                      value={time.id}
                    >
                      {time.title}
                    </Radio>
                    <Divider style={{ margin: 0, padding: 0 }} />
                  </>
                ))}
              </Radio.Group>
            )}
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
                    ((!hasTouchedFields || hasErrors) && !audioURL)
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
          closable={false}
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
                  <IoStopSharp color="#ff0033" size={isMobile ? 30 : 50} />
                ) : (
                  <SlMicrophone color="#0098a9" size={isMobile ? 30 : 50} />
                )
              }
            ></Button>
            {recording && (
              <Text style={{ textAlign: 'center' }} type="secondary">
                در حال ضبط صدا
              </Text>
            )}
            {audioURLModal && <audio src={audioURLModal} controls />}
          </div>
        </Modal>
      )}
    </>
  );
};

export default SendTicket;
