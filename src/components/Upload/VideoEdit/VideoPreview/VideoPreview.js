import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

import styles from './VideoPreview.module.scss';
import Image from '../../../Image';
import {
  VideoPreviewActionsIcon,
  VideoPreviewLiveIcon,
  VideoPreviewSearchIcon,
} from '../../../Icons';
import CustomControllerVideo from '../../../CustomControllerVideo';

const cx = classNames.bind(styles);

const VideoPreview = forwardRef(({ videoSource, caption }, ref) => {
  const { currentUser } = useSelector((state) => state.user);

  const handlePreviewClick = (event) => {
    ref.current.togglePlayPause(event);
  };

  return (
    <div className={cx('video-preview')}>
      <div className={cx('preview-overlay')}></div>
      <div className={cx('preview-video-container')}>
        <CustomControllerVideo
          ref={ref}
          videoSource={videoSource}
          className={cx('preview-video-player')}
          noPlayBtn
          noSoundBtn
          transparentBg
          bigSize
          clickToPlaySmall
          onClick={handlePreviewClick}
        />
      </div>
      <div className={cx('preview-header')}>
        <div className={cx('preview-header-live-icon')}>
          <VideoPreviewLiveIcon />
        </div>
        <div className={cx('preview-header-title')}>
          <div className={cx('preview-header-title-item')}>Following</div>
          <div className={cx('preview-header-title-item', 'active')}>For You</div>
        </div>
        <div className={cx('preview-header-search-icon')}>
          <VideoPreviewSearchIcon />
        </div>
      </div>
      <div className={cx('preview-actions')}>
        <div>
          <Image className={cx('preview-actions-avatar')} src={currentUser.avatar} alt={'Avatar'} />
        </div>
        <div className={cx('preview-actions-icons')}>
          <VideoPreviewActionsIcon />
        </div>
        <div>
          <div className={cx('preview-actions-album-container')}>
            <Image
              className={cx('preview-actions-album')}
              src={currentUser.avatar}
              alt={'Avatar'}
            />
          </div>
        </div>
      </div>
      <div className={cx('preview-metadata')}>
        <div className={cx('preview-user-name')}>{currentUser.nickname}</div>
        <div className={cx('preview-video-caption')}>{caption}</div>
        <div className={cx('preview-video-sound')}>
          <FontAwesomeIcon icon={faMusic} />
          &nbsp;-&nbsp;
          <span>original sound</span>
        </div>
      </div>
      <div className={cx('preview-navbar')}></div>
    </div>
  );
});

VideoPreview.propTypes = {
  videoSource: PropTypes.string,
  caption: PropTypes.string,
};

export default VideoPreview;
