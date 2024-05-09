import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faCommentDots,
  faBookmark,
  faShare,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import Image from '../../Image';
import Button from '../../Button';
import VideoActionButton from '../../VideoActionButton/VideoActionButton';
import CustomControllerVideo from '../../CustomControllerVideo/CustomControllerVideo';
import { followClick } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function Video({ video, scrollState, from }) {
  const [isFollowed, setIsFollowed] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [isFavorite, setIsFavorite] = useState(null);
  const [numLikes, setNumLikes] = useState(null);
  const [numFavorites, setNumFavorites] = useState(null);

  const videoRef = useRef();

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { t } = useTranslation('common');

  const followUser = async () => {
    setIsFollowed(true);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/follow/${video.user._id}`);
    dispatch(followClick([video.user._id]));
  };

  const unfollowUser = async () => {
    setIsFollowed(false);
    await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/unfollow/${video.user._id}`,
    );
    dispatch(followClick([video.user._id]));
  };

  const likeVideo = async () => {
    setIsLiked(true);
    setNumLikes(numLikes + 1);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/like/${video._id}`);
  };

  const unlikeVideo = async () => {
    setIsLiked(false);
    setNumLikes(numLikes - 1);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/unlike/${video._id}`);
  };

  const favoriteVideo = async () => {
    setIsFavorite(true);
    setNumFavorites(numFavorites + 1);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/favorite/${video._id}`);
  };

  const notfavoriteVideo = async () => {
    setIsFavorite(false);
    setNumFavorites(numFavorites - 1);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/notfavorite/${video._id}`);
  };

  const handleFollowClick = async () => {
    if (currentUser) {
      if (isFollowed) {
        unfollowUser();
      } else {
        followUser();
      }
    } else {
      alert('Please log in to follow this user!');
    }
  };

  const handleLikeClick = async () => {
    if (currentUser) {
      if (isLiked) {
        unlikeVideo();
      } else {
        likeVideo();
      }
    } else {
      alert('Please log in to like this video!');
    }
  };

  const handleFavoriteClick = async () => {
    if (currentUser) {
      if (isFavorite) {
        notfavoriteVideo();
      } else {
        favoriteVideo();
      }
    } else {
      alert('Please log in to add this video to favorite list!');
    }
  };

  const handleCommentClick = () => {
    navigate(`/${video.user.nickname}/video/${video._id}`, {
      state: { scrollPosition: scrollState, from: from },
    });
  };

  useEffect(() => {
    if (currentUser?.following.includes(video.user._id)) {
      setIsFollowed(true);
    }
  }, [video, currentUser]);

  useEffect(() => {
    setNumLikes(video.likesCount);
    setNumFavorites(video.favoritesCount);
  }, [video.likesCount, video.favoritesCount]);

  useEffect(() => {
    if (video?.likes.includes(currentUser?._id)) {
      setIsLiked(true);
    }
  }, [currentUser, video.likes]);

  useEffect(() => {
    if (video?.favorites.includes(currentUser?._id)) {
      setIsFavorite(true);
    }
  }, [currentUser, video.favorites]);

  // Make a bar to indicate how many % the video has loaded
  // useEffect(() => {
  //   const videoPlayer = document.getElementById('videoPlayer');

  //   videoPlayer.addEventListener('progress', () => {
  //     const buffered = videoPlayer.buffered;
  //     if (buffered.length > 0) {
  //       const loadedPercentage = (buffered.end(0) / videoPlayer.duration) * 100;
  //       console.log(`Video loaded: ${loadedPercentage.toFixed(2)}%`);
  //     }
  //   });
  // });

  return (
    <div className={cx('video-container')}>
      <Link to={`/profile/${video.user._id}`}>
        <Image className={cx('user-avatar')} src={video.user.avatar} alt={'Avatar'} />
      </Link>
      <div className={cx('video-content')}>
        <div className={cx('video-content-header')}>
          <div className={cx('video-content-data')}>
            <div className={cx('video-user-info')}>
              <Link to={`/profile/${video.user._id}`}>
                <h3 className={cx('video-user-name')}>{video.user.nickname}</h3>
              </Link>
              <h4 className={cx('video-user-nickname')}>{video.user.name}</h4>
            </div>
            <div className={cx('video-caption')}>{video.description}</div>
            <div className={cx('video-sound')}>
              <FontAwesomeIcon icon={faMusic} />
              <span>&nbsp;{t('sound')} -&nbsp;</span>
              <span className={cx('video-user-nickname')}>{video.user.name}</span>
            </div>
          </div>
          <Button
            className={cx({
              'follow-btn': !currentUser?.following.includes(video.user._id),
              'unfollow-btn': currentUser?.following.includes(video.user._id),
            })}
            outline
            onClick={handleFollowClick}
          >
            {currentUser?.following.includes(video.user._id)
              ? `${t('following')}`
              : `${t('follow')}`}
          </Button>
        </div>

        {/* <video id={'videoPlayer'} width={400} height={400} controls>
          <source src={video.videoURL} type="video/mp4" />
        </video> */}
        <div className={cx('video-content-main')}>
          <CustomControllerVideo
            className={cx('video-player')}
            videoSource={video.videoURL}
            videoId={video._id}
            videoOwner={video.user}
            isLink
            autoPlay={true}
            ref={videoRef}
            scrollState={scrollState}
            from={from}
          />
          <div className={cx('video-action')}>
            <div className={cx('video-action-btn')}>
              <VideoActionButton
                icon={faHeart}
                clickedColor="rgb(254, 44, 85)"
                isClicked={isLiked}
                onClick={handleLikeClick}
              />
              <span className={cx('video-like-counter')}>{numLikes}</span>
            </div>
            <div className={cx('video-action-btn')}>
              <VideoActionButton onClick={handleCommentClick} icon={faCommentDots} noIcon />
              <span className={cx('video-comment-counter')}>{video.commentsCount}</span>
            </div>
            <div className={cx('video-action-btn')}>
              <VideoActionButton
                icon={faBookmark}
                clickedColor="rgb(250,206,21)"
                isClicked={isFavorite}
                onClick={handleFavoriteClick}
              />
              <span className={cx('video-save-counter')}>{numFavorites}</span>
            </div>
            <div className={cx('video-action-btn')}>
              <VideoActionButton icon={faShare} />
              <span className={cx('video-share-counter')}>888</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Video.propTypes = {
  video: PropTypes.object,
  scrollState: PropTypes.number,
  from: PropTypes.string,
};

export default Video;
