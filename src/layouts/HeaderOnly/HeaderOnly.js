import classNames from 'classnames/bind';
import styles from './HeaderOnly.module.scss';

import Header from '../../layouts/components/Header';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
  return (
    <div>
      <Header />
      <div className={cx('container')}>{children}</div>
    </div>
  );
}

export default HeaderOnly;
