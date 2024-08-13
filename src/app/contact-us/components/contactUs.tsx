'use client';

import Header from '@/app/_components/header/header';
import globalStyle from '../../layout.module.scss';
import style from './contactUs.module.scss';
import { Divider, Space, Typography } from 'antd';
const { Text, Title } = Typography;

const ContactUs = () => {
  const info = [
    {
      title: 'شماره تماس:',
      type: 'secondary',
      subTitle: '86095112 – 86095208',
      subType: 'default',
    },
    {
      title: 'آدرس',
      type: 'secondary',
      subTitle:
        'تهران، بلوار پژوهش، نرسیده به اتوبان همت، شهرک چیتگر، نیم طبقه غربی، برج G4',
      subType: 'default',
    },
    {
      title: 'کد پستی:',
      type: 'secondary',
      subTitle: '1496960534',
      subType: 'default',
    },
    {
      title: 'شماره ثبت:',
      type: 'secondary',
      subTitle: '239661',
      subType: 'default',
    },
  ];

  return (
    <>
      <Header />

      <div className={`${globalStyle.container}`}>
        <div className={`${style.title_container}`}>
          <Title className={`${style.ant_typography}`} level={3}>
            تماس با ما
          </Title>
          <Title
            className={`${style.ant_typography}`}
            level={3}
            type="secondary"
          >
            تی‌ویژه
          </Title>
          <Divider />
        </div>
        <div className={`${style.content_container}`}>
          <div className={`${style.info_container}`}>
            {info.map((item, index) => (
              <Space key={index}>
                <Text style={{ whiteSpace: 'nowrap' }} type={item.type}>
                  {item.title}
                </Text>
                <Text type={item.subType}>{item.subTitle}</Text>
              </Space>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
