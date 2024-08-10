import { Radio, Typography } from 'antd';

import styles from './radioCard.module.scss';
import Image from 'next/image';
import React from 'react';
const { Text } = Typography;
interface IRadioCard {
  text: string;
  id: string;
  image: string;
  selected: boolean;
  onSelect: () => '';
  hasImage?: boolean;
}
export const RadioCard: React.FunctionComponent<IRadioCard> = ({
  text,
  id,
  onSelect,
  image,
  selected,
  hasImage = true,
}) => {
  const handleClick = () => {
    onSelect(id);
  };

  return (
    <div
      className={`${styles.rectangle} ${selected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.leftSide}>
        {hasImage ? <Image alt="" src={image} width={30} height={30} /> : ''}
        <span className={styles.text}>{text}</span>
      </div>
      <Radio value={id} checked={selected} />
    </div>
  );
};
