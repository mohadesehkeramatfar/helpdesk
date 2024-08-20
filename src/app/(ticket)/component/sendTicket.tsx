'use client';
import style from './sendTicket.module.scss';
import { Button, Divider, Form, Radio, Spin } from 'antd';
import {
  useGetParentCategoriesList,
  useGetSubCategoriesList,
  usePostUnitTicketPostSubmit,
  usePostUnitTicketSubmit,
} from '../api/ticket';
import { useGetUserInfo } from '@/app/auth/api/auth';
import { useEffect, useRef, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { RadioCard } from '@/app/_components/radio/radioCard';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { generalMessage, successfulTicketRegister } from '@/lib/alertMessage';
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
    </>
  );
};

export default SendTicket;
