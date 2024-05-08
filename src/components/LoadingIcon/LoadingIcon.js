import { forwardRef } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './LoadingIcon.module.scss';

const cx = classNames.bind(styles);

const LoadingIcon = forwardRef(
  ({ defaultLoad, feedFirstLoad, browserFirstLoad, commentFirstLoad, moreLoad }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('loading-icon-container', {
          'default-load': defaultLoad,
          'feed-first-load': feedFirstLoad,
          'browser-first-load': browserFirstLoad,
          'comment-first-load': commentFirstLoad,
          'more-load': moreLoad,
        })}
      >
        <div className={cx('loading-dot-container')}>
          <div className={cx('loading-dot', 'red')}></div>
          <div className={cx('loading-dot', 'blue')}></div>
        </div>
      </div>
    );
  },
);

LoadingIcon.propTypes = {
  feedFirstLoad: PropTypes.bool,
  browserFirstLoad: PropTypes.bool,
};

export default LoadingIcon;
