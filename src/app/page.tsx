'use client';
import styles from './page.module.scss';
import dynamic from 'next/dynamic';
import { Button, Spin, Typography } from 'antd';
import Image from 'next/image';
import banner from '@/assets/image/banner.jpg';
import Title from 'antd/es/typography/Title';
import iptv from '@/assets/image/iptv.jpg';
import time from '@/assets/image/time.jpg';
import register from '@/assets/image/register.png';
import globalStyle from './layout.module.scss';
import useResponsive from '@/lib/hook/useResponsive';
const { Text } = Typography;
const Header = dynamic(() => import('./_components/header/header'), {
  loading: () => <Spin />,
  ssr: false,
});

export default function Home() {
  const { isMobile } = useResponsive();
  const listCategor = [
    {
      id: '0',
      desc: 'طراحی این سیستم با هدف دریافت درخواست‌های پشتیبانی سرویس‌های فعال بر بستر نظارت تصویری ساختمان ها این سیستم با هدف دریافت درخواست های پشتیبانی سرویس های فعال بر بستر FTTH شامل IPTV، آیفون تصویری،اینترنت، تلفن و سیستم نظارت تصویری ساختمان ها طراحی گردیده است. FTTH شامل IPTV، آیفون تصویری،‌اینترنت،‌‌‌تلفن و سیستم ',
      src: iptv,
    },
    {
      id: '1',
      desc: 'زمان پاسخ دهی به تیکت های ارسالی شما حداکثر دو روز کاری و در حین ساعات اداری 8 الی 17:30 می باشد. لازم به ذکر است در صورتی که خرابی غیر عرفی وجود داشته باشد یا رفع درخواست شما نیازمند عملیات سازمانی دیگر همانند مخابرات باشد این زمان ممکن است بیشتر از این مقدار طول بکشد. خواهشمند است در هر صورت از طریق تیکت با ما در ارتباط باشید',
      src: time,
      revers: true,
    },
    {
      id: '',
      desc: 'لازم به ذکر است ثبت‌نام در سایت جهت ارسال تیکت الزامی می‌باشد. شما می توانید نتیجه انجام درخواست خود را از طریق ورود مجدد به همین سایت مشاهده فرمائید',
      src: register,
    },
  ];
  return (
    <>
      {/* <Header /> */}
      <main className={`${styles.main}`}>
        <Header />
        <div className={`${styles.banner_container}`}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 152, 169, 0.1)',
              zIndex: 1,
            }}
          ></div>
          <Image
            src={banner}
            style={{
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
              zIndex: 0,
            }}
            alt="سیستم پشتیبانی برج‌های شهرک چیتگر"
          />
          <div className={`${styles.title_banner_container}`}>
            <Title className={`${styles.title}`} level={isMobile ? 3 : 1}>
              پشتیبانی سیستم‌های جریان ضعیف شهرک چیتگر
            </Title>
            <Button
              // style={{ backgroundColor: 'transparent', color: 'white' }}
              type="default"
            >
              ارسال تیکت
            </Button>
          </div>
        </div>
        {/* category_container */}
        <div className={`${styles.content_container} ${globalStyle.container}`}>
          <ul className={`${styles.list_content}`}>
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
      </main>
    </>
  );
}

{
  // ! new category
  /* <div
          className={`${styles.category_container} ${globalStyle.container}`}
        >
          {listCategor.map((item) => {
            return (
              <div
                data-revers={item.revers}
                key={item.id}
                className={`${styles.category}`}
              >
                <div className={`${styles.image_category}`}>
                  <Image
                    objectFit="cover"
                    objectPosition="center"
                    src={item.src}
                    layout="fill"
                    alt={''}
                  />
                </div>
                <Text className={`${styles.desc_category}`}>{item.desc}</Text>
              </div>
            );
          })}
        </div> */
}
{
  /* <>
<Header />
<main className={`${styles.main} ${globalStyle.container}`}>
  <Title className={`${styles.title}`} level={2}>
    سیستم پشتیبانی برج‌های شهرک چیتگر
  </Title>

  <div className={`${styles.content_container}`}>
    <ul className={`${styles.list_content}`}>
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
    <div className={`${styles.img_container}`}>
      <Image
        width={600}
        height={600}
        alt="تی‌ویژه"
        src={'/image/tower3.jpg'}
        className={`${styles.img}`}
      />
    </div>
  </div>
</main>
</> */
}
