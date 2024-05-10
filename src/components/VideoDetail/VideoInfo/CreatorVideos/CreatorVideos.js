import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './CreatorVideos.module.scss';
import LoadingIcon from '../../../LoadingIcon';

const cx = classNames.bind(styles);

function CreatorVideos({ video }) {
  const [userVideos, setUserVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const fetchedVideos = (
          await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${video.user.id}/videos/?page=1&limit=5`,
            { withCredentials: true },
          )
        ).data.data.videos;
        setUserVideos(fetchedVideos);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserVideos();
  }, [video.user.id]);

  return (
    <>
      {!isLoading ? (
        <div className={cx('creator-video-container')}>
          <div className={cx('creator-video-list')}>
            {userVideos.map((userVideo) => {
              return (
                <Link key={userVideo._id} to={`/${video.user.nickname}/video/${userVideo._id}`}>
                  <div className={cx('video-item')}>
                    <video className={cx('video-player')} width="100%" height="100%">
                      <source src={userVideo.videoURL} type="video/mp4" />
                    </video>
                    <div className={cx('video-view-container')}>
                      <FontAwesomeIcon className={cx('video-view-icon')} icon={faPlay} />
                      <span className={cx('video-view-counter')}>{userVideo.view}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={cx('creator-video-loader')}>
          <LoadingIcon />
        </div>
      )}
    </>
  );
}

export default CreatorVideos;
