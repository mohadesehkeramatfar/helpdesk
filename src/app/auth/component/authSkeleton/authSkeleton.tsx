'use client';
import { Skeleton, Space } from 'antd';
import style from './authSkeleton.module.scss';
const AuthSkeleton = () => {
  return (
    <div className={`${style.skeleton_container}`}>
      <Skeleton.Image active={true} className={`${style.image}`} />
      <Skeleton.Input active={true} size={'large'} block={false} />
      <Skeleton.Input active={true} size={'large'} block={false} />

      <Skeleton.Input active={true} size={'small'} block={true} />
      <Skeleton.Button
        active={true}
        size={'small'}
        shape={'default'}
        block={true}
      />
    </div>
  );
};

export default AuthSkeleton;
