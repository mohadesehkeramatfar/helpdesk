import { failedUpload, successfulTicketRegister } from '@/lib/alertMessage';
import {
  Button,
  Divider,
  Flex,
  Form,
  Radio,
  Spin,
  Typography,
  Upload,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import style from './sendTicket.module.scss';
import { useRef, useState } from 'react';
import {
  useDeletePostTicket,
  useDeleteTicket,
  useGetSubCategoriesList,
  usePatchTicketPostAdd,
  usePostUnitTicketPostSubmit,
  usePostUnitTicketSubmit,
} from '../../api/ticket';
import { RadioCard } from '@/app/_components/radio/radioCard';
import TextArea from 'antd/es/input/TextArea';
import { MdAttachFile, MdOutlineKeyboardVoice } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import useResponsive from '@/lib/hook/useResponsive';
const { Title, Text } = Typography;

const SendTicketForm = ({
  userInfo,
  categoryList,
  audioURL,
  setShowRecordModal,
  showRecordModal,
  setAudioURLModal,
  setRecording,
  setAudioURL,
  getValidTicketTimeIntervals,
  setAudioBlobFile,
  audioBlobFile,
}) => {
  const [ticketForm] = useForm();
  const router = useRouter();
  const refSubCategory = useRef(null);
  const refDesc = useRef(null);
  const { isMobile } = useResponsive();

  const {
    trigger: getSubCategoriesList,
    isMutating: isLoadingGetSubCategoryList,
  } = useGetSubCategoriesList();
  const { trigger: postUnitTicketSubmit } = usePostUnitTicketSubmit();
  const {
    trigger: postUnitTicketPostSubmit,
    isMutating: postUnitTicketLoading,
  } = usePostUnitTicketPostSubmit();
  const { trigger: patchTicketPostAdd } = usePatchTicketPostAdd();
  const { trigger: deletePostTicket } = useDeletePostTicket();
  const { trigger: deleteTicket } = useDeleteTicket();
  const [removedFiles, setRemovedFiles] = useState([]);
  const [parentCategoryValue, setParentCategoryValue] = useState('');
  const [subCategoryValue, setsubCategoryValue] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeList, setSelectedTimeList] = useState([]);

  const [fileList, setFileList] = useState([]);

  const onChangeCategoryList = async (id) => {
    setParentCategoryValue(id);
    setsubCategoryValue('');
    try {
      const { data: subCategoriesListResponsed } = await getSubCategoriesList({
        id,
      });

      setSubCategoryList(subCategoriesListResponsed);
      refSubCategory?.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {}
  };

  const onChangeSubCategory = (id) => {
    setsubCategoryValue(id);
    refDesc?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const deleteFiles = async (ticketPostId: string, ticketId: string) => {
    try {
      await deletePostTicket(ticketPostId);
      await deleteTicket(ticketId);
    } catch (error) {
      toast.error(failedUpload);
    }
    // setTimeout(() => window.location.reload(), 5000);
  };

  const postTicketHandler = async (values: { message: string }) => {
    const { message } = values;
    const ticketData = {
      unit: userInfo.id,
      categories: [parentCategoryValue, subCategoryValue],
      status: '55c66a81-91fc-4d4c-85c9-00328aacc2eb',
      visit_interval: selectedTime,
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
        }
        successTicket(postUnitTicketSubmitResponse.id);
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
  const successTicket = () => {
    toast.success(successfulTicketRegister);
    ticketForm.resetFields();
    setTimeout(() => {
      router.push(`/my-ticket`);
    }, 4000);
  };
  const groupedData = getValidTicketTimeIntervals?.data.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { weekday: item.weekday, data: [] };
    }
    acc[item.date].data.push(item);
    return acc;
  }, {});
  return (
    <Form
      form={ticketForm}
      layout="vertical"
      onFinish={postTicketHandler}
      className={`${style.form_container}`}
    >
      {/* PARENT CATEGORY */}
      <div className={`${style.question_section}`}>
        <Text style={{ fontWeight: 'bold' }}>مشکل شما چیست؟ </Text>
        <Radio.Group
          value={parentCategoryValue}
          className={`${style.radio_container}`}
        >
          {categoryList.map(
            (item: { icon: string; name: string; id: string }) => {
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
              <Text style={{ fontWeight: 'bold' }}>
                مشکل شما در کدام دسته قرار میگیرد؟
              </Text>
              <Radio.Group
                value={subCategoryValue}
                className={`${style.radio_container}`}
              >
                {subCategoryList.map((item: { name: string; id: string }) => {
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
                })}
              </Radio.Group>
            </div>
          ))}
      </div>

      {/* MESSAGES AND ATTACHMENT */}
      <div className={`${style.question_section}`} ref={refDesc}>
        <div className={`${style.message_content}`}>
          <Form.Item
            rules={[
              {
                required: !audioURL && true,
                message: 'لطفا این قسمت را خالی نگذارید',
              },
            ]}
            name="message"
            label="مشکل خود را شرح دهید"
            style={{ fontWeight: 'bold' }}
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
        </div>
      </div>

      {/* REFERRAL TIME */}
      <div className={`${style.referral_time_container}`}>
        <Flex vertical={true} gap={'5px'}>
          {' '}
          <Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
            زمان مذکور، زمان پیشنهادی شماست و زمان قطعی مراجعه کارشناس با شما
            هماهنگ خواهد شد.
          </Text>
        </Flex>
        <div className={`${style.date_card_container}`}>
          {Object.entries(groupedData).map(([key, value], index) => {
            return (
              <Button
                key={index}
                style={{ padding: '30px 15px', minWidth: '100px' }}
                className={`${style.date_card}  ${selectedDay === key ? style.selected : ''}`}
                onClick={() => {
                  setSelectedDay(selectedDay === key ? null : key);
                  setSelectedTimeList(value.data);
                }}
              >
                <Title level={5}>{value?.weekday}</Title>
                <Text type="secondary">{key}</Text>
              </Button>
            );
          })}
        </div>
        <Divider style={{ margin: 0, padding: 0 }} />
        {selectedTimeList.length
          ? selectedTimeList.map((time) => {
              return (
                <>
                  <Radio
                    // disabled={!time.limit}
                    key={time.id}
                    value={time.id}
                    onChange={() => setSelectedTime(time.id)}
                  >
                    {time.start_time.split(':')[0]}:
                    {time.start_time.split(':')[1]} تا{' '}
                    {time.end_time.split(':')[0]}:{time.end_time.split(':')[1]}
                  </Radio>
                  <Divider style={{ margin: 0, padding: 0 }} />
                </>
              );
            })
          : ''}
      </div>

      <Form.Item className={`${style.form_item}`} shouldUpdate>
        {() => {
          const hasTouchedFields = ticketForm.isFieldsTouched();
          const hasErrors =
            ticketForm.getFieldsError().filter(({ errors }) => errors.length)
              .length > 0;

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
  );
};
export default SendTicketForm;
