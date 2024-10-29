import { Button, Modal, Typography } from 'antd';
import { useRef } from 'react';
import style from './ticketDetail.module.scss';
import { IoStopSharp } from 'react-icons/io5';
import { SlMicrophone } from 'react-icons/sl';
const { Text } = Typography;
const RecordModal = ({
  showRecordModal,
  setAudioBlobFile,
  setAudioURLModal,
  setRecording,
  setShowRecordModal,
  setAudioURL,
  audioURLModal,
  recording,
}) => {
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

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

  return (
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
          <audio className={`${style.audio}`} src={audioURLModal} controls />
        )}
      </div>
    </Modal>
  );
};

export default RecordModal;
