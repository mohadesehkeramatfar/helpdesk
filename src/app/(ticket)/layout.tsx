import Header from '../_components/header/header';
import globalStyle from '../layout.module.scss';
const TicketLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <div className={`${globalStyle.container}`}>{children}</div>
    </>
  );
};

export default TicketLayout;
