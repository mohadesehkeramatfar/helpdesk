'use client';
import style from './sendTicket.module.scss';
import { Divider, Spin, Typography } from 'antd';
import {
  useGetParentCategoriesList,
  useGetValidTicketTimeIntervals,
} from '../../api/ticket';
import { useGetUserInfo } from '@/app/auth/api/auth';
import { useEffect, useState } from 'react';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useError } from '@/lib/hook/errorContext';
import RecordModal from './RecordModal';
import SendTicketForm from './SendTicketForm';
const { Title } = Typography;
const SendTicket = () => {
  const { handleError } = useError();
  const {
    trigger: getParentCategoriesList,
    isMutating: loadingGetParentCategory,
  } = useGetParentCategoriesList();
  const { trigger: getUserInfo, isMutating: isLoadingGetUserInfo } =
    useGetUserInfo();
  const {
    data: getValidTicketTimeIntervals,
    isLoading: getValidTicketTimeIntervalsLoading,
  } = useGetValidTicketTimeIntervals();

  const [categoryList, setCategoryList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURLModal, setAudioURLModal] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [audioBlobFile, setAudioBlobFile] = useState({});
  const [showRecordModal, setShowRecordModal] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const { data: userInfo } = await getUserInfo();
      setUserInfo(userInfo);
    } catch (error) {
      handleError(error);
    }
  };
  const fetchParentCategory = async () => {
    try {
      const { data: parentCategoriesList } = await getParentCategoriesList();
      setCategoryList(parentCategoriesList);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchParentCategory();
  }, []);

  if (
    isLoadingGetUserInfo ||
    loadingGetParentCategory ||
    getValidTicketTimeIntervalsLoading
  ) {
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
        <SendTicketForm
          userInfo={userInfo}
          categoryList={categoryList}
          audioURL={audioURL}
          setShowRecordModal={setShowRecordModal}
          showRecordModal={showRecordModal}
          setAudioURLModal={setAudioURLModal}
          setRecording={setRecording}
          setAudioURL={setAudioURL}
          getValidTicketTimeIntervals={getValidTicketTimeIntervals}
          setAudioBlobFile={setAudioBlobFile}
          audioBlobFile={audioBlobFile}
        />
      </div>

      <RecordModal
        showRecordModal={showRecordModal}
        setShowRecordModal={setShowRecordModal}
        setAudioURLModal={setAudioURLModal}
        setAudioURL={setAudioURL}
        audioURLModal={audioURLModal}
        recording={recording}
        setAudioBlobFile={setAudioBlobFile}
        setRecording={setRecording}
      />
    </>
  );
};

export default SendTicket;
