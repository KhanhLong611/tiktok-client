import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './VideoActionButton.module.scss';

const cx = classNames.bind(styles);

function VideoActionButton({ small, noIcon, icon, clickedColor, isClicked, onClick }) {
  return (
    <button className={cx('video-action-icon', { small: small, noIcon: noIcon })} onClick={onClick}>
      {isClicked ? (
        <FontAwesomeIcon icon={icon} color={clickedColor} className={cx('video-action-btn')} />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
    </button>
  );
}

VideoActionButton.propTypes = {
  small: PropTypes.bool,
  noIcon: PropTypes.bool,
  icon: PropTypes.object,
  clickedColor: PropTypes.string,
  isClicked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default VideoActionButton;
