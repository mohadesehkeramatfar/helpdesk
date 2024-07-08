import localFont from 'next/font/local';

export const IranYekanX = localFont({
  src: '../../assets/fonts/IRANYekanXVFaNumVF.woff2',
  display: 'swap',
  variable: '--font-yekanx',
  declarations: [
    {
      prop: 'font-variation-settings',
      value: '"dots" 1',
    },
  ],
});
