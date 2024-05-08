import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // faLock,

  faPlay,
} from '@fortawesome/free-solid-svg-icons';

import LoadingIcon from '../../LoadingIcon';

const cx = classNames.bind(styles);

function VideoList({ user, isActive, handleMenuItemClick }) {
  const [isMore, setIsMore] = useState(true);
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noVidMessage, setNoVidMessage] = useState('');

  const loadingIconRef = useRef();

  const { t } = useTranslation('userProfile');

  const fetchMoreVideos = useCallback(async () => {
    let moreVideos;
    let URL;

    if (user) {
      switch (isActive) {
        case 'videos':
          URL = `/api/v1/users/${user._id}/videos/?page=${page + 1}&limit=10`;
          break;
        case 'favorites':
          URL = `/api/v1/users/${user._id}/videos/favorites/?page=${page + 1}&limit=10`;
          break;
        case 'liked':
          URL = `/api/v1/users/${user._id}/videos/liked/?page=${page + 1}&limit=10`;
          break;
        default:
          URL = `/api/v1/users/${user._id}/videos`;
          break;
      }
    }

    moreVideos = (await axios.get(URL)).data.data?.videos;

    if (moreVideos && moreVideos.length > 0) {
      setVideos([...videos, ...moreVideos]);
      setPage(page + 1);
    } else if (!moreVideos || moreVideos?.length === 0) {
      setIsMore(false);
    }
  }, [isActive, page, user, videos]);

  // Fetch the initial videos
  useEffect(() => {
    let URL;
    let message;
    if (user) {
      switch (isActive) {
        case 'videos':
          URL = `/api/v1/users/${user._id}/videos/?page=1&limit=10`;
          message = `${t('noVideoMessage')}`;
          break;
        case 'favorites':
          URL = `/api/v1/users/${user._id}/videos/favorites/?page=1&limit=10`;
          message = `${t('noFavoritesMessage')}`;
          break;
        case 'liked':
          URL = `/api/v1/users/${user._id}/videos/liked/?page=1&limit=10`;
          message = `${t('noLikeMessage')}`;
          break;
        default:
          URL = `/api/v1/users/${user._id}/videos`;
          message = `${t('noVideoMessage')}`;
          break;
      }
    }

    let ignore = false;

    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(URL);
        let videos = data.data.videos;
        if (videos && videos.length > 0) {
          if (ignore) {
            return;
          } else {
            setVideos(videos);
          }
        } else {
          setVideos([]);
          setNoVidMessage(message);
          setIsMore(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) fetchVideos();

    return () => {
      ignore = true;
      setIsMore(true);
    };
  }, [isActive, user, t]);

  // Fetch more videos
  useEffect(() => {
    const loadingIcon = loadingIconRef.current;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 1,
    };

    const callback = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        fetchMoreVideos();
      }
    };

    const observer = new IntersectionObserver(callback, options);

    if (loadingIcon) {
      observer.observe(loadingIcon);
    }

    return () => {
      if (loadingIcon) {
        observer.unobserve(loadingIcon);
      }
    };
  }, [fetchMoreVideos]);

  return (
    <div className={cx('user-videos-container')}>
      <div className={cx('video-menu-tab')}>
        <div
          className={cx('menu-tab-item', { active: isActive === 'videos' })}
          onClick={() => handleMenuItemClick('videos')}
        >
          {/* <FontAwesomeIcon icon={faLock} /> */}
          <span className={cx('tab-item-name')}>{t('videos')}</span>
        </div>
        <div
          className={cx('menu-tab-item', { active: isActive === 'favorites' })}
          onClick={() => handleMenuItemClick('favorites')}
        >
          {/* <FontAwesomeIcon icon={faLock} /> */}
          <span className={cx('tab-item-name')}>{t('favorites')}</span>
        </div>
        <div
          className={cx('menu-tab-item', { active: isActive === 'liked' })}
          onClick={() => handleMenuItemClick('liked')}
        >
          {/* <FontAwesomeIcon icon={faLock} /> */}
          <span className={cx('tab-item-name')}>{t('likes')}</span>
        </div>
        <div className={cx('menu-bottom-line')}></div>
      </div>
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <>
          <div className={cx('creator-video-list')}>
            {videos.map((video) => {
              return (
                <div key={video._id} className={cx('video-item')}>
                  <Link
                    to={`/${video.user.nickname}/video/${video._id}`}
                    state={{ from: `/profile/${user._id}`, active: isActive }}
                  >
                    <video className={cx('video-player')} width="100%" height="100%">
                      <source src={video.videoURL} type="video/mp4" />
                    </video>
                  </Link>
                  <div className={cx('video-view-container')}>
                    <FontAwesomeIcon className={cx('video-view-icon')} icon={faPlay} />
                    <span className={cx('video-view-counter')}>{video.view}</span>
                  </div>
                  <div className={cx('video-caption-container')}>
                    <div className={cx('video-caption')}>{video.description}</div>
                  </div>
                </div>
              );
            })}
            {videos.length === 0 && <div className={cx('video-list-message')}>{noVidMessage}</div>}
          </div>
          {videos && isMore ? (
            <div className={cx('video-loader-container')}>
              <LoadingIcon ref={loadingIconRef} />
            </div>
          ) : (
            <div className={cx('no-more-text', { 'no-video': videos.length === 0 })}>
              {t('noMoreVideoMessage')}
            </div>
          )}
        </>
      )}
    </div>
  );
}

VideoList.propTypes = {
  user: PropTypes.object,
  isActive: PropTypes.string,
  handleMenuItemClick: PropTypes.func,
};

export default VideoList;
