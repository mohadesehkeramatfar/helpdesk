import {
  useGetTicketTimeline,
  useUnitTicketDetail,
} from '@/app/(ticket)/api/ticket';
import { Divider, Spin } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import style from './ticketDetail.module.scss';
import RecordModal from './RecordModal';
import ReplyForm from './ReplyForm';
import TimeLine from './Timeline';
import TitleDetail from './TitleDetail';
import { useError } from '@/lib/hook/errorContext';

const TicketDetail = () => {
  const { id } = useParams();
  const { handleError } = useError();
  const { trigger: getTicketTimeline, isMutating: getTicketTimelineLoading } =
    useGetTicketTimeline();
  const { trigger: getUnitTicketDetail } = useUnitTicketDetail();

  const [audioBlobFile, setAudioBlobFile] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURLModal, setAudioURLModal] = useState('');
  const [audioURL, setAudioURL] = useState('');

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [timelineList, setTimelineList] = useState([]);
  const [unitTicketDetail, setUnitTicketDetail] = useState({});

  const [testLoading, setTestLoading] = useState(true);
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
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  if (testLoading) {
    return <Spin />;
  }

  const { categories, user, status, created_at, visit_interval } =
    unitTicketDetail;

  return (
    <div className={`${style.ticket_detail_container}`}>
      {/* TITLE CONTAINER */}
      <TitleDetail unitTicketDetail={unitTicketDetail} />
      <TimeLine timelineList={timelineList} />
      <Divider style={{ margin: 0, padding: 0 }} />
      <ReplyForm
        id={id}
        audioBlobFile={audioBlobFile}
        setAudioURL={setAudioURL}
        audioURL={audioURL}
        fetchTimelineData={fetchTimelineData}
        setShowRecordModal={setShowRecordModal}
        setAudioURLModal={setAudioURLModal}
        setRecording={setRecording}
        showRecordModal={showRecordModal}
        setAudioBlobFile={setAudioBlobFile}
      />
      <RecordModal
        showRecordModal={showRecordModal}
        setAudioBlobFile={setAudioBlobFile}
        setAudioURLModal={setAudioURLModal}
        setRecording={setRecording}
        setShowRecordModal={setShowRecordModal}
        setAudioURL={setAudioURL}
        audioURLModal={audioURLModal}
        recording={recording}
      />
    </div>
  );
};
export default TicketDetail;
