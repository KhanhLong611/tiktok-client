import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoCover.module.scss';
import { forwardRef, useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

const VideoCover = forwardRef(({ videoSrc }, ref) => {
  const videoRef = useRef(null);

  // Allow video cover seek on scroll
  useEffect(() => {
    const outerDiv = document.getElementsByClassName(`${cx('video-cover-container')}`)[0];

    const innerDiv = document.getElementsByClassName(`${cx('video-cover')}`)[0];

    const video = document.getElementsByClassName(`${cx('video-cover-player')}`)[0];

    let isDragging = false;
    let initialX, offsetX, minPosition, maxPosition;

    const handleMouseDown = (e) => {
      isDragging = true;
      initialX = e.clientX;
      offsetX = innerDiv.getBoundingClientRect().left - initialX;
      minPosition = 0;
      maxPosition = outerDiv.offsetWidth - parseFloat(getComputedStyle(innerDiv).width) * 1.1;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      let newX = e.clientX + offsetX - outerDiv.getBoundingClientRect().left;

      // Ensure the thumb stays within the scrollbar range
      newX = Math.max(minPosition, Math.min(newX, maxPosition));

      innerDiv.style.left = `${newX}px`;

      // Check if video duration is finite before setting currentTime
      if (video.duration) {
        const scrollPercentage = (newX / maxPosition) * 100;
        const videoTime = (scrollPercentage / 100) * video.duration;

        // Debounce the seeking by using requestAnimationFrame
        // Ensure that it's only called once per animation frame, rather than potentially being called multiple times in quick succession.
        requestAnimationFrame(() => {
          // Schedule a function to be executed right before the next repaint
          video.currentTime = videoTime;
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
      }
    };

    innerDiv.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners when the component unmounts
    return () => {
      innerDiv.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 8 video cover images captured using canvas
  useEffect(() => {
    const video = videoRef.current;
    const videoPlayback = document.querySelector(`.${cx('video-playback')}`);
    const numThumbnails = 8;

    const captureThumbnails = async () => {
      const videoDuration = video.duration;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const canvasWidth = 1400; // Increase canvas dimensions for higher quality
      canvas.width = canvasWidth;
      canvas.height = (video.videoHeight / video.videoWidth) * canvasWidth;

      for (let i = 0; i < numThumbnails; i++) {
        const currentTime = (i / (numThumbnails - 1)) * videoDuration;
        video.currentTime = currentTime;

        await new Promise((resolve) => {
          video.addEventListener(
            'seeked',
            () => {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Increase quality (set quality to 0.9 for example)
              const thumbnailURL = canvas.toDataURL('image/jpeg', 0.9);

              const thumbnailImage = document.createElement('img');
              thumbnailImage.src = thumbnailURL;
              thumbnailImage.classList.add(`${cx('thumbnail')}`);
              videoPlayback.appendChild(thumbnailImage);

              resolve();
            },
            { once: true }, // an options object that configures the behavior of the event listener. Setting once to true indicates that you want the event listener to listen for the event only once. Once the event has been triggered and the listener has executed, it will automatically remove itself, preventing it from being triggered again for subsequent occurrences of the same event.
          );
        });
      }
    };

    video.addEventListener('loadedmetadata', captureThumbnails);

    return () => {
      video.removeEventListener('loadedmetadata', captureThumbnails);
    };
  }, [videoSrc]);

  return (
    <div className={cx('video-cover-container')}>
      <div className={cx('video-cover')}>
        <video ref={ref} className={cx('video-cover-player')} preload="metadata" muted>
          <source src={videoSrc}></source>
        </video>
      </div>
      <div className={cx('video-playback')}>
        {/* Showing the list of the video playback images */}
        <video
          style={{ display: 'none' }}
          ref={videoRef}
          className={cx('video-to-capture')}
          preload="metadata"
          muted
        >
          <source src={videoSrc}></source>
        </video>
      </div>
    </div>
  );
});

VideoCover.propTypes = {
  videoSrc: PropTypes.string,
};

export default VideoCover;
