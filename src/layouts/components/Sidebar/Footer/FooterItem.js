import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function FooterItem({ label }) {
  return (
    <div>
      <Link to={`/${label.toLowerCase().split(' ').join('-')}`} className={cx('footer-item')}>
        {label}
      </Link>
    </div>
  );
}

FooterItem.propTypes = {
  label: PropTypes.string.isRequired,
};

export default FooterItem;
