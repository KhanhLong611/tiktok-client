import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import styles from './VideoUploadIcon.module.scss';

const cx = classNames.bind(styles);

function VideoUploadIcon({ progressPercentage }) {
  return (
    <div className={cx('wrapper')}>
      <CircularProgressbar
        value={progressPercentage}
        text={`${progressPercentage}%`}
        strokeWidth={4}
        styles={buildStyles({
          textSize: '16px',
          pathColor: '#fe2c55',
          textColor: '#fe2c55',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
}

VideoUploadIcon.propTypes = {
  processProgress: PropTypes.number,
};

export default VideoUploadIcon;
