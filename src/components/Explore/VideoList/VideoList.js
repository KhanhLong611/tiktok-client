import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Video({ video }) {
  return (
    <div key={video._id} className={cx('video-item')}>
      <Link
        to={`/${video.user.nickname}/video/${video._id}`}
        state={{ from: '/explore', active: video.tag }}
      >
        <video className={cx('video-player')} width="100%" height="100%">
          <source src={video.videoURL} type="video/mp4" />
        </video>
        <div className={cx('video-view-container')}>
          <FontAwesomeIcon className={cx('video-view-icon')} icon={faPlay} />
          <span className={cx('video-view-counter')}>{video.view}</span>
        </div>
        <div className={cx('video-description-container')}>
          <div className={cx('video-caption')}>{video.description}</div>
          <div className={cx('video-info-container')}>
            <div className={cx('video-user-container')}>
              <div className={cx('video-user-avatar')}>
                <img src={`${video.user.avatar}`} alt="" />
              </div>
              <div className={cx('video-user-nickname')}>{video.user.nickname}</div>
            </div>
            <div className={cx('video-like-container')}>
              <div className={cx('video-like-icon')}>
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <div className={cx('video-like-counter')}>{video.likesCount}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function VideoList({ category }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial videos
  useEffect(() => {
    setIsLoading(true);

    let ignore;
    const fetchVideos = async () => {
      const res = await axios.get(`/api/v1/explore?tag=${category.toLowerCase()}`);

      const videos = res.data.data.videos;
      if (!ignore) {
        setVideos(videos);
      }
    };

    fetchVideos();
    setIsLoading(false);

    return () => {
      ignore = true;
      setIsLoading(null);
      setVideos([]);
    };
  }, [category]);

  return (
    <div className={cx('video-list')}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        videos.map((video) => {
          return <Video key={video._id} video={video} />;
        })
      )}
    </div>
  );
}

VideoList.propTypes = {
  category: PropTypes.string,
};

export default VideoList;
