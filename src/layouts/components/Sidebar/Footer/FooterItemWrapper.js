import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function FooterItemWrapper({ children }) {
  return <div className={cx('footer-item-container')}>{children}</div>;
}

FooterItemWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FooterItemWrapper;
