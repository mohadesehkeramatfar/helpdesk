import { Steps } from 'antd';
import style from './layout.module.scss';
import Image from 'next/image';
const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={`${style.auth_container}`}>
      <div className={`${style.children_container}`}>{children}</div>
    </div>
  );
};

export default AuthLayout;
