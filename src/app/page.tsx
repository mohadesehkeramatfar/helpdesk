import Image from 'next/image';
import styles from './page.module.scss';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import globalStyle from './layout.module.scss';
import Title from 'antd/es/typography/Title';
const Header = dynamic(() => import('./_components/header/header'), {
  loading: () => <Spin />,
  ssr: false,
});
export default function Home() {
  return (
    <>
      {' '}
      <Header />
      <main className={`${styles.main} ${globalStyle.container}`}>
        <div className={`${styles.content_container}`}>
          <h2>به سیستم پشتیبانی برج‌های شهرک چیتگر خوش‌آمدید.</h2>

          <ul>
            <li>
              این سیستم با هدف دریافت درخواست های پشتیبانی سرویس های فعال بر
              بستر FTTH شامل IPTV، آیفون تصویری، اینترنت، تلفن و سیستم نظارت
              تصویری ساختمان ها طراحی گردیده است.
            </li>
            <li>
              زمان پاسخ دهی به تیکت های ارسالی شما حداکثر دو روز کاری و در حین
              ساعات اداری 8 الی 17:30 می باشد. لازم به ذکر است در صورتی که خرابی
              غیر عرفی وجود داشته باشد یا رفع درخواست شما نیازمند عملیات سازمانی
              دیگر همانند مخابرات باشد این زمان ممکن است بیشتر از این مقدار طول
              بکشد. خواهشمند است در هر صورت از طریق تیکت با ما در ارتباط باشید.
            </li>
            <li>
              لطفا از تماس تلفنی با هر یک از کارشناسان پشتیبانی مجموعه خودداری
              فرمائید.
            </li>
            <li>
              لازم به ذکر است ثبت‌نام در سایت جهت ارسال تیکت الزامی می‌باشد. شما
              می توانید نتیجه انجام درخواست خود را از طریق ورود مجدد به همین
              سایت مشاهده فرمائید.
            </li>
          </ul>
        </div>
        <Image
          width={600}
          height={600}
          src={'/image/tower3.jpg'}
          className={`${styles.img}`}
        />
      </main>
    </>
  );
}
