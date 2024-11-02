import { Button, Form, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import style from './ticketDetail.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdAttachFile, MdOutlineKeyboardVoice } from 'react-icons/md';
import { useState } from 'react';
import {
  usePatchTicketPostAdd,
  usePostUnitTicketPostSubmit,
} from '@/app/(ticket)/api/ticket';
import { useError } from '@/lib/hook/errorContext';

const { Title } = Typography;

const ReplyForm = ({
  setAudioURL,
  audioBlobFile,
  fetchTimelineData,
  audioURL,
  setShowRecordModal,
  setAudioURLModal,
  setRecording,
  showRecordModal,
  setAudioBlobFile,
  id,
}) => {
  const [ticketForm] = useForm();
  const { handleError } = useError();
  const {
    trigger: postUnitTicketPostSubmit,
    isMutating: postUnitTicketLoading,
  } = usePostUnitTicketPostSubmit();
  const { trigger: patchTicketPostAdd } = usePatchTicketPostAdd();
  const [newMessageLoading, setNewMessageLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
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
  const handleAudioUpload = async (postId: string) => {
    const audioFile = new File([audioBlobFile], `recording${new Date()}.wav`, {
      type: 'audio/wav',
    });
    const formData = new FormData();
    formData.append('file', audioFile);
    try {
      await patchTicketPostAdd({ id: postId, data: formData });
      setAudioURL('');
      // fetchTimelineData();
    } catch (error) {
      // deleteFiles
    }
  };
  const handleFileUploads = async (postId: string) => {
    fileList.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file?.originFileObj);
      try {
        await patchTicketPostAdd({
          id: postId,
          data: formData,
        });
        setFileList([]);
        console.log('file', file);
      } catch (error) {}
    });

    // setFileList([]);
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
      if (audioBlobFile && audioURL && fileList.length > 0) {
        if (audioBlobFile && audioURL)
          handleAudioUpload(postUnitTicketPostSubmitResponsed.id);
        if (fileList.length > 0)
          handleFileUploads(postUnitTicketPostSubmitResponsed.id);

        fetchTimelineData();
        return;
      }
      if (audioBlobFile && audioURL)
        handleAudioUpload(postUnitTicketPostSubmitResponsed.id);
      if (fileList.length > 0)
        handleFileUploads(postUnitTicketPostSubmitResponsed.id);

      fetchTimelineData();
      ticketForm.resetFields();
    } catch (error) {
      handleError(error);
    } finally {
      setNewMessageLoading(false);
    }
  };

  return (
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
  );
};
export default ReplyForm;
