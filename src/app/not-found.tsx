import { Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import Image from 'next/image';
import style from './notFound.module.scss';
import Link from 'next/link';
export default async function NotFound() {
  return (
    <div className={`${style.container}`}>
      <div className={`${style.title}`}>
        <Typography>
          <Title level={2}>صفحه مورد نظر شما یافت نشد!</Title>
        </Typography>
        <Link className={`${style.link}`} href={'/'}>
          صفحه اصلی
        </Link>
      </div>
      <Image
        src={'/image/page-not-found.webp'}
        // objectFit="contain"
        width={700}
        height={400}
        // sizes="100vw"
        // style={{ width: '100%', height: '100vh' }} // optional
        // objectFit="contain"
        alt={''}
      />
    </div>
  );
}
