import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { changeVolume, setMuted } from '../../redux/volumeSlice';
import styles from './CustomControllerVideo.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// Chỉ là custom thanh volume, nút play/pause và seek bar.
// forwardRef ra ngoài để cho Video trong VideoDetail dùng với nút play/pause và thanh âm lượng custom
const CustomControllerVideo = forwardRef(function CustomControllerVideo(
  {
    videoSource,
    videoId,
    videoOwner,
    className,
    isLink,
    scrollState,
    from,
    autoPlay,
    noPlayBtn,
    noSoundBtn,
    noSeekBar,
    mgBotController,
    transparentBg,
    bigSize,
    onClick,
    clickToPlay,
    clickToPlaySmall,
    onVideoDimension,
  },
  ref,
) {
  const [isLoading, setIsLoading] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);
  const volumeBarRef = useRef(null);
  const seekBarRef = useRef(null);

  const { currentVolume, isMuted } = useSelector((state) => state.volume);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => {
    return {
      video: videoRef.current,
      togglePlayPause,
      toggleMute,
      handleVolumeChangeOutside,
    };
  });

  const classes = [className, cx('custom-controller-vid')].join(' ');

  const togglePlayPause = (event) => {
    if (event) {
      event.stopPropagation();
    }
    const videoElement = videoRef.current;

    if (videoElement.paused) {
      setIsPlaying(true);
      videoElement.play();
    } else if (!videoElement.paused) {
      setIsPlaying(false);
      videoElement.pause();
    }
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    const videoElement = videoRef.current;
    videoElement.muted = !isMuted;
    dispatch(setMuted(!isMuted));
  };

  const handleVolumeChange = (event) => {
    // event.stopPropagation();
    const videoElement = videoRef.current;
    const volumeBar = event.target;
    const newVolume = volumeBar.value / 100;

    if (newVolume === 0) {
      dispatch(setMuted(true));
    } else {
      dispatch(setMuted(false));
    }

    videoElement.volume = newVolume;
    dispatch(changeVolume(newVolume));

    const gradient = `linear-gradient(to right, var(--white) 0%, var(--white) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;
    volumeBar.style.background = gradient;
  };

  const handleVolumeChangeOutside = (value) => {
    const videoElement = videoRef.current;
    const newVolume = value / 100;
    if (newVolume === 0) {
      dispatch(setMuted(true));
    } else {
      dispatch(setMuted(false));
    }
    dispatch(changeVolume(newVolume));
    videoElement.volume = newVolume;
  };

  const handleTimeChange = (event) => {
    event.stopPropagation();
    const videoElement = videoRef.current;
    const seekBar = event.target;
    let newTime = (seekBar.value / 100) * videoElement.duration;
    if (newTime === 0) {
      setIsPlaying(true);
      videoElement.play();
    }
    if (videoElement.currentTime === videoElement.duration) {
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
      setIsPlaying(true);
      videoElement.play();
    } else {
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    }

    const gradient = `linear-gradient(to right, var(--white) 0%, var(--white) ${seekBar.value}%, rgba(211, 211, 211, 0.6) ${seekBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;
    seekBar.style.background = gradient;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Add event listeners for changing video volume
  useEffect(() => {
    const videoElement = videoRef.current;
    const volumeBar = volumeBarRef.current;

    videoElement.volume = currentVolume;

    volumeBar.value = currentVolume * 100;
    volumeBar.style.background = `linear-gradient(to right, var(--white) 0%, var(--white) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;

    if (currentVolume === 0) {
      dispatch(setMuted(true));
    }
  }, [currentVolume, dispatch]);

  // Add event listeners for when video first load video's current time and volume change
  useEffect(() => {
    const videoElement = videoRef.current;
    const volumeBar = volumeBarRef.current;
    const seekBar = seekBarRef.current;

    const handleLoadedVideo = () => {
      // Set isLandscape state when loaded
      const isLandscape = videoElement.videoWidth > videoElement.videoHeight;
      if (isLandscape) {
        setIsLandscape(true);
      }

      // Set the width and height state of <Video/> in <VideoFeed/>
      if (onVideoDimension) {
        onVideoDimension(videoElement.videoWidth, videoElement.videoHeight);
      }

      // Update the duration and add event listener
      setDuration(videoElement.duration);

      // Update the volume bar color when loaded
      volumeBar.style.background = `linear-gradient(to right, var(--white) 0%, var(--white) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) ${volumeBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;
    };

    const handleVideoSeek = () => {
      setCurrentTime(videoElement.currentTime);
      seekBar.value = (videoElement.currentTime / videoElement.duration) * 100;

      const gradient = `linear-gradient(to right, var(--white) 0%, var(--white) ${seekBar.value}%, rgba(211, 211, 211, 0.6) ${seekBar.value}%, rgba(211, 211, 211, 0.6) 100%)`;
      seekBar.style.background = gradient;
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedVideo);
    videoElement.addEventListener('timeupdate', handleVideoSeek);
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedVideo);
        videoElement.removeEventListener('timeupdate', handleVideoSeek);
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [onVideoDimension]);

  // Set loading effect when video is loading
  useEffect(() => {
    const videoElement = videoRef.current;
    const handleLoadVideo = () => {
      setIsLoading(true);
    };

    const handleLoadedVideo = () => {
      setIsLoading(false);
    };

    if (videoElement) {
      videoElement.addEventListener('loadstart', handleLoadVideo);
      videoElement.addEventListener('loadedmetadata', handleLoadedVideo);
    }
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadVideo);
      videoElement.removeEventListener('loadedmetadata', handleLoadedVideo);
    };
  }, []);

  // Use Intersection Observer to auto play and pause video when scrolling
  useEffect(() => {
    if (autoPlay) {
      let playPromise;
      const handlePlay = (entries) => {
        entries.forEach((entry) => {
          // if (navigator.userActivation.hasBeenActive) {
          if (entry.isIntersecting) {
            playPromise = videoElement.play();
            playPromise
              .then(() => {
                setIsPlaying(true);
                // console.log('play');
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsPlaying(false);
                // console.log('pause');
                videoElement.pause();
              });
            }
          }
          // }
        });
      };

      const videoElement = videoRef.current;
      const observer = new IntersectionObserver(handlePlay, { threshold: 0.5 });
      if (videoElement) {
        observer.observe(videoElement);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [autoPlay]);

  return (
    <div className={classes} onClick={onClick}>
      {isLink ? (
        <Link
          to={`/${videoOwner.nickname}/video/${videoId}`}
          state={{ scrollPosition: scrollState, from: from }}
        >
          <video
            className={cx('video', {
              'transparent-bg': transparentBg,
              landscape: isLandscape,
              isLoading: isLoading,
            })}
            ref={videoRef}
            width="100%"
            height="100%"
            muted={isMuted}
            preload="auto"
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        </Link>
      ) : (
        <video
          className={cx('video', { 'transparent-bg': transparentBg })}
          ref={videoRef}
          width="100%"
          height="100%"
          muted={isMuted}
          loop
        >
          <source src={videoSource} type="video/mp4" />
        </video>
      )}
      <div className={cx('video-controller', { 'margin-bottom': mgBotController })}>
        <div className={cx('play-mute-controller', { 'no-seek-bar': noSeekBar })}>
          <button
            className={cx('toggle-play-btn', { hidden: noPlayBtn })}
            onClick={togglePlayPause}
          >
            {videoRef.current &&
              (videoRef.current.paused ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <FontAwesomeIcon icon={faPause} />
              ))}
          </button>

          <div className={cx('volume-controller', { hidden: noSoundBtn })}>
            <button className={cx('toggle-volume-btn')} onClick={toggleMute}>
              {isMuted ? (
                <FontAwesomeIcon icon={faVolumeXmark} />
              ) : (
                <FontAwesomeIcon icon={faVolumeHigh} />
              )}
              <input
                ref={volumeBarRef}
                className={cx('volume-bar')}
                type="range"
                min="0"
                max="100"
                step="1"
                value={currentVolume * 100}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onChange={handleVolumeChange}
              />
            </button>
          </div>
        </div>

        <div className={cx('progress-controller', { hidden: noSeekBar })}>
          <input
            ref={seekBarRef}
            className={cx('seek-bar', { 'big-size': bigSize })}
            type="range"
            min="0"
            max="100"
            step="1"
            value={(currentTime / duration) * 100 || 0}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onChange={handleTimeChange}
          />
          <div className={cx('time-counter', { 'big-size': bigSize })}>
            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      {!isPlaying & (clickToPlay || clickToPlaySmall) && (
        <div className={cx('video-play-icon', { small: clickToPlaySmall })}>
          <FontAwesomeIcon icon={faPlay} />
        </div>
      )}
    </div>
  );
});

CustomControllerVideo.propTypes = {
  videoSource: PropTypes.string,
  videoId: PropTypes.string,
  videoOwner: PropTypes.object,
  className: PropTypes.string,
  isLink: PropTypes.bool,
  muted: PropTypes.bool,
  noPlayBtn: PropTypes.bool,
  noSoundBtn: PropTypes.bool,
  noSeekBar: PropTypes.bool,
  mgBotController: PropTypes.bool,
  transparentBg: PropTypes.bool,
  bigSize: PropTypes.bool,
  onClick: PropTypes.func,
  clickToPlay: PropTypes.bool,
  clickToPlaySmall: PropTypes.bool,
  onVideoDimension: PropTypes.func,
};

export default CustomControllerVideo;
