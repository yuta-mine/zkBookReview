import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import styles  from './styles/style.module.css';

export const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Link href="/">
        <Image src="/logo.png" width={200} height={200} alt="logo"/>
      </Link>
    </div>
  )
}
