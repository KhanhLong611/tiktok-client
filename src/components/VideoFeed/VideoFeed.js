import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import axios from 'axios';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './VideoFeed.module.scss';
import Video from './Video';
import LoadingIcon from '../LoadingIcon/LoadingIcon';

const cx = classNames.bind(styles);

function VideoFeed({ type }) {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(null);
  const [isMore, setIsMore] = useState(true);
  const [fetchNew, setFetchNew] = useState();
  const [currentPosition, setCurrentPosition] = useState(0);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const wrapperRef = useRef();
  const loadingIconRef = useRef();
  const currentUserRef = useRef();
  const { currentUser } = useSelector((state) => state.user);

  const { t } = useTranslation('videoFeed');

  const fetchMoreVideos = useCallback(async () => {
    let moreVideos;
    if (type === 'random') {
      moreVideos = (
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/random?page=${page + 1}`)
      ).data.data?.videos;
    } else if (type === 'following') {
      moreVideos = (
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/following?page=${page + 1}`)
      ).data.data?.videos;
    }
    if (moreVideos && moreVideos.length > 0) {
      setVideos([...videos, ...moreVideos]);
      setPage(page + 1);
    } else if (!moreVideos || moreVideos?.length === 0) {
      setIsMore(false);
    }
  }, [page, type, videos]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Set scroll position when back from video browser page
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    // Must have videos (videos === truthy) before scrolling to the previous position
    if (videos && location.state?.scrollPosition) {
      if (wrapper.scrollTop > location.state?.scrollPosition) {
        // Prevent scrolling back to top when browsing videos
        return;
      } else {
        // Scroll to the previous position when left
        wrapper.scrollTo(0, location.state?.scrollPosition);
      }
    }
  }, [videos, location.state?.scrollPosition]);

  // Set current scroll position while scrolling
  useEffect(() => {
    const wrapper = wrapperRef.current;

    const handleScroll = () => {
      setCurrentPosition(Math.floor(wrapper.scrollTop));
    };

    wrapper.addEventListener('scroll', handleScroll);

    return () => {
      wrapper.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Set fetchNew base on query parameter for the below fetch videos effect
  useEffect(() => {
    if (searchParams.get('new') === 'false') {
      setFetchNew(searchParams.get('new'));
    } else {
      setFetchNew(true);
    }
  }, [searchParams]);

  // Fetch the initial videos
  useEffect(() => {
    let ignore = false;
    const wrapper = wrapperRef.current;
    const getVideos = async () => {
      let fetchedVideos;
      const currentUser = currentUserRef.current;
      // Fetch random or following videos based on the query parameter
      if (type === 'random') {
        fetchedVideos = (
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/random?new=${fetchNew}`)
        ).data.data.videos;
      } else if (type === 'following' && currentUser) {
        fetchedVideos = (
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/following?page=1`)
        ).data.data.videos;
      }
      if (!ignore && fetchedVideos?.length > 0) {
        setVideos(fetchedVideos);
        wrapper.scrollTo(0, location.state?.scrollPosition);
      } else if (!ignore) {
        setIsMore(false);
      }
    };
    getVideos();
    return () => {
      ignore = true;
    };
  }, [type, fetchNew, location.state?.scrollPosition]);

  // Fetch more videos
  useEffect(() => {
    const loadingIcon = loadingIconRef.current;

    const options = {
      root: null,
      rootMargin: '300px',
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
    <div className={cx('wrapper')} ref={wrapperRef}>
      {type === 'following' && !currentUser ? (
        <div className={cx('video-feed-warning')}>{t('notLoginMessage')}</div>
      ) : videos ? (
        <div className={cx('video-feed-container')}>
          {videos.map((video) => {
            return (
              <Video
                key={video._id}
                video={video}
                scrollState={currentPosition}
                from={location.pathname}
              />
            );
          })}
          {isMore ? (
            <LoadingIcon ref={loadingIconRef} />
          ) : (
            <div className={cx('video-feed-footer')}>{t('noMoreVideoMessage')}</div>
          )}
        </div>
      ) : (
        <div className={cx('video-feed-container')}>
          {isMore && <LoadingIcon feedFirstLoad />}
          {!isMore && <div className={cx('video-feed-warning')}>{t('noFollowMessage')}</div>}
        </div>
      )}
    </div>
  );
}

VideoFeed.propTypes = {
  type: PropTypes.string,
};

export default VideoFeed;
