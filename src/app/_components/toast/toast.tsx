import { ToastContainer } from 'react-toastify';

export const ToastComponent = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      // transition:Bounce
    />
  );
};
