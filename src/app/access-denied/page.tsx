'use client';
import Image from 'next/image';
import style from './AccessDenied.module.scss';
import Link from 'next/link';
const AccessDenied = () => {
  return (
    <div className={`${style.container}`}>
      <h1 className={`${style.title}`}>
        متاسفانه شما به این صفحه دسترسی ندارید
      </h1>
      <Link className={`${style.link}`} href={'/'}>
        صفحه پروفایل
      </Link>
      <Image
        width={300}
        height={300}
        src="/image/access.png"
        alt=""
        className={`${style.image}`}
      />
    </div>
  );
};

export default AccessDenied;
