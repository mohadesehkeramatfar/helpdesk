import { Button, Modal, Typography } from 'antd';
import style from './sendTicket.module.scss';
import { IoStopSharp } from 'react-icons/io5';
import { SlMicrophone } from 'react-icons/sl';
import useResponsive from '@/lib/hook/useResponsive';
import { useRef } from 'react';
const { Text } = Typography;
const RecordModal = ({
  showRecordModal,
  setShowRecordModal,
  setAudioURLModal,
  setAudioURL,
  audioURLModal,
  recording,
  setAudioBlobFile,
  setRecording,
}) => {
  const { isMobile } = useResponsive();
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const handleCancelRecord = () => {
    setShowRecordModal(false);
    setAudioURLModal('');
  };
  const handleSendRecord = () => {
    setShowRecordModal(false);
    setAudioURL(audioURLModal);
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

  return (
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
  );
};
export default RecordModal;
