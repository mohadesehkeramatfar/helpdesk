'use client';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';

const ContactUs = dynamic(() => import('./components/contactUs'), {
  loading: () => <Spin />,
  ssr: false,
});

const ContactUsPage = () => {
  return <ContactUs />;
};

export default ContactUsPage;
