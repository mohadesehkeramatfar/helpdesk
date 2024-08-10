import style from './layout.module.scss';
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
