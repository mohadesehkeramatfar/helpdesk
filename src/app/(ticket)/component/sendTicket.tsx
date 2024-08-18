'use client';
import style from './sendTicket.module.scss';
import { Button, Form, Radio, Spin } from 'antd';
import {
  useGetParentCategoriesList,
  useGetSubCategoriesList,
  usePostUnitTicketPostSubmit,
  usePostUnitTicketSubmit,
} from '../api/ticket';
import { useGetUserInfo } from '@/app/auth/api/auth';
import { useEffect, useRef, useState, useTransition } from 'react';
import Title from 'antd/es/typography/Title';
import { RadioCard } from '@/app/_components/radio/radioCard';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { successfulTicketRegister } from '@/lib/alertMessage';
import { ToastComponent } from '@/app/_components/toast/toast';
import { useForm } from 'antd/es/form/Form';
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
  const [isPending, startTransition] = useTransition();
  const [parentCategoryValue, setParentCategoryValue] = useState('');
  const [subCategoryValue, setsubCategoryValue] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const fetchUserInfo = async () => {
    const { data: userInfo } = await getUserInfo();
    setUserInfo(userInfo);
  };
  const onChangeCategoryList = async (id) => {
    setParentCategoryValue(id);
    setsubCategoryValue('');
    console.log('subCategoryValue', !subCategoryValue ? 'false' : 'true');

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

    // ! اینجا باگ درست کن اگه یکیش اررور خورد هیچ کاری نکمه promiseAll or inseprable try catch
    try {
      const { data: postUnitTicketSubmitResponse } = await postUnitTicketSubmit(
        { data: ticketData },
      );
      const ticketPostData = {
        message,
        ticket: postUnitTicketSubmitResponse.id,
        media: '',
      };

      try {
        await postUnitTicketPostSubmit({ data: ticketPostData });
        toast.success(successfulTicketRegister);
        setTimeout(() => {
          router.push(`/my-ticket/${postUnitTicketSubmitResponse.id}`);
        }, 4000);
      } catch (error) {}
    } catch (error) {}
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (isLoadingGetUserInfo || loadingGetParentCategory) {
    return <Spin />;
  }

  const imageUrls = [
    '/icon/fiberOptic.png',
    '/icon/telephone.png',
    '/icon/wifi.png',
    '/icon/intercomePanel1.png',
    '/icon/iptv.jpg',
    '/icon/iptv.jpg',
  ];

  return (
    <>
      <ToastComponent />
      <div className={`${style.send_ticket_container}`}>
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
                  item: { name: string; id: string },
                  index: string | number,
                ) => {
                  return (
                    <RadioCard
                      key={item.id}
                      id={item.id}
                      text={item.name}
                      image={imageUrls[index]}
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
          <div ref={refDesc}>
            <Form.Item
              rules={[
                { required: true, message: 'لطفا این قسمت را خالی نگذارید' },
              ]}
              name="message"
              label="متن"
              // required
            >
              <TextArea rows={4} />
            </Form.Item>
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
            {/* <Button
              className={`${style.btn}`}
              type="primary"
              htmlType="submit"
              loading={postUnitTicketLoading}
              disabled={!parentCategoryValue || !subCategoryValue}
            >
              ارسال تیکت
            </Button> */}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SendTicket;
