import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faEllipsis, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import Search from '../../../layouts/components/Search';
import CustomControllerVideo from '../../CustomControllerVideo/CustomControllerVideo';
import { changeVolume, setMuted } from '../../../redux/volumeSlice';

const cx = classNames.bind(styles);

function Video({ video, scrollState, from }) {
  const [videoSize, setVideoSize] = useState({});

  const videoRef = useRef(null);
  const volumeBarRef = useRef(null);

  const { currentVolume, isMuted } = useSelector((state) => state.volume);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoBack = () => {
    if (from === '/') {
      navigate(`/?new=false`, { state: { scrollPosition: scrollState } });
    } else if (from === '/following') {
      navigate(`/following`, { state: { scrollPosition: scrollState } });
    } else if (from?.startsWith('/profile')) {
      navigate(`${from}/?active=${location.state.active}`);
    } else if (from === '/explore') {
      navigate(`/explore?active=${location.state.active}`);
    } else {
      navigate('/');
    }
  };

  const handleVideoClick = (event) => {
    videoRef.current.togglePlayPause(event);
  };

  const handleMuteToggle = (event) => {
    dispatch(setMuted(!isMuted));
    videoRef.current.toggleMute(event);
  };

  const handleVolumeChange = (event) => {
    const newValue = event.target.value;
    if (newValue > 0) {
      dispatch(setMuted(false));
    } else {
      dispatch(setMuted(true));
    }
    dispatch(changeVolume(newValue / 100));
    if (videoRef.current) {
      videoRef.current.handleVolumeChangeOutside(newValue);
    }

    const volumeBar = volumeBarRef.current;
    const gradient = `linear-gradient(to right, var(--white) 0%, var(--white) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;
    volumeBar.style.background = gradient;
  };

  const handleVideoDimension = (width, height) => {
    setVideoSize({ width: width, height: height });
  };

  useEffect(() => {
    if (currentVolume === 0) dispatch(setMuted(true));
  }, [dispatch, currentVolume]);

  useEffect(() => {
    const volumeBar = volumeBarRef.current;

    const handleLoadedVideo = () => {
      // Update the volume bar color when loaded
      volumeBar.style.background = `linear-gradient(to right, var(--white) 0%, var(--white) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;

      // Check if the video is portrait or landscape to handle the video and it's background scaling
      if (videoSize.width > videoSize.height) {
        const video = videoRef.current.video;
        const videoBackground = document.getElementsByClassName(
          `${cx('video-player-background')}`,
        )[0];
        if (video) {
          video.classList.add(cx('landscape'));
        }
        if (videoBackground) {
          videoBackground.classList.add(cx('landscape'));
        }
      }
    };
    handleLoadedVideo();

    return () => {};
  }, [videoSize]);

  return (
    <div className={cx('video-player')}>
      <div className={cx('video-player-header')}>
        <div className={cx('close-btn')} onClick={handleGoBack}>
          <FontAwesomeIcon icon={faX} />
        </div>
        <Search border transparent />
        <div className={cx('more-btn')}>
          <FontAwesomeIcon icon={faEllipsis} />
        </div>
      </div>
      <div className={cx('video-player-main')}>
        <CustomControllerVideo
          ref={videoRef}
          className={cx('video-main')}
          videoSource={video.videoURL}
          noSoundBtn
          noPlayBtn
          mgBotController
          bigCounter
          onClick={handleVideoClick}
          clickToPlay
          onVideoDimension={handleVideoDimension}
          autoPlay={false}
        />
      </div>
      <div className={cx('video-player-background')}>
        <video width="100%" height="100%">
          <source src={video.videoURL} type="video/mp4" />
        </video>
      </div>
      {/* <div className={cx('navigation-control')}>
        <div className={cx('next-btn')}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
        <div className={cx('prev-btn')}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      </div> */}
      <div className={cx('sound-control')}>
        <div className={cx('mute-btn')} onClick={handleMuteToggle}>
          {!isMuted ? (
            <FontAwesomeIcon icon={faVolumeHigh} />
          ) : (
            <FontAwesomeIcon icon={faVolumeXmark} />
          )}
        </div>
        <input
          className={cx('volume-bar')}
          ref={volumeBarRef}
          type="range"
          min="0"
          max="100"
          step="1"
          value={currentVolume * 100}
          onChange={handleVolumeChange}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}

Video.propTypes = {
  video: PropTypes.object,
};

export default Video;
