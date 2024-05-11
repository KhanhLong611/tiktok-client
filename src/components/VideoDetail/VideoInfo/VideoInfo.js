import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMusic,
  faHeart,
  faCommentDots,
  faBookmark,
  faShare,
  faCode,
  faPaperPlane,
  faAt,
} from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { formatDistanceToNow } from 'date-fns';

import styles from './VideoInfo.module.scss';
import Image from '../../Image';
import Button from '../../Button';
import Comments from './VideoComments/';
import CreatorVideos from './CreatorVideos';
import { Wrapper as PopperWrapper } from '../../Popper';
import AccountPreview from '../../SuggestedAccounts/AccountPreview/AccountPreview';
import VideoActionButton from '../../VideoActionButton/VideoActionButton';
import { favoriteClick, likeClick } from '../../../redux/videoSlice';
import { followClick } from '../../../redux/userSlice';
import LoadingIcon from '../../LoadingIcon';

const cx = classNames.bind(styles);

function VideoInfo({ video }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showComments, setShowComments] = useState(true);
  const [commentDisable, setCommentDisabled] = useState(true);

  const commentInputRef = useRef(null);
  const pageURLRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { t } = useTranslation('videoDetail');

  const handleLikeClick = async () => {
    if (currentUser) {
      if (!video.likes.includes(currentUser._id)) {
        dispatch(likeClick(currentUser._id));
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/like/${video._id}`,
          {},
          {
            withCredentials: true,
          },
        );
      } else {
        dispatch(likeClick(currentUser._id));
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/unlike/${video._id}`,
          {},
          {
            withCredentials: true,
          },
        );
      }
    } else {
      alert('Please log in to like this video!');
    }
  };

  const handleFavoriteClick = async () => {
    if (currentUser) {
      if (!video.favorites.includes(currentUser._id)) {
        dispatch(favoriteClick(currentUser._id));
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/favorite/${video._id}`,
          {},
          { withCredentials: true },
        );
      } else {
        dispatch(favoriteClick(currentUser._id));
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/notfavorite/${video._id}`,
          {},
          { withCredentials: true },
        );
      }
    } else {
      alert('Please log in to add this video to favorite list!');
    }
  };

  const handleFollowClick = async () => {
    if (currentUser) {
      if (currentUser.following.includes(video.user._id)) {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/unfollow/${video.user._id}`,
          {},
          { withCredentials: true },
        );
        dispatch(followClick([video.user._id, currentUser._id]));
      } else {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/follow/${video.user._id}`,
          {},
          { withCredentials: true },
        );
        dispatch(followClick([video.user._id, currentUser._id]));
      }
    } else {
      alert('Please log in to follow this user!');
    }
  };

  const handleCommentClick = () => {
    if (currentUser) {
      if (commentInputRef.current) commentInputRef.current.focus();
    } else {
      alert('Please log in to comment on this video!');
    }
  };

  const handleCommentChange = () => {
    if (commentInputRef.current.value.trim() !== '') {
      setCommentDisabled(false);
    } else {
      setCommentDisabled(true);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentContent = commentInputRef.current.value.trim();
    if (commentContent !== '') {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}videos/${video._id}/comments`,
        {
          content: commentContent,
        },
      );
      const comment = res.data.data.document;
      setComments([comment, ...comments]);
      setCommentDisabled(true);
      commentInputRef.current.value = '';
    } else {
      alert('Please enter a comment!');
    }
  };

  const handleCopyURLClick = () => {
    const text = pageURLRef.current.innerHTML;
    if (pageURLRef.current) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('Coppied URL to clipboard: ' + text);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const pageURL = window.location.href;

  const renderPreview = (attrs) => {
    return (
      <div tabIndex="-1" {...attrs}>
        <PopperWrapper>
          <AccountPreview data={video.user} />
        </PopperWrapper>
      </div>
    );
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = (
          await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/${video._id}/comments/`,
            { withCredentials: true },
          )
        ).data.data.documents;
        setComments(fetchedComments);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [video._id]);

  return (
    <div className={cx('info-container')}>
      <div className={cx('comment-container')}>
        <div className={cx('comment-list-container')}>
          <div className={cx('video-info-container')}>
            <div className={cx('video-description-container')}>
              <div className={cx('video-user-container')}>
                <div>
                  <HeadlessTippy
                    interactive
                    offset={[50, 10]}
                    delay={[800, 0]}
                    render={renderPreview}
                    placement="bottom"
                  >
                    <div className={cx('user-info')}>
                      <Link to={`/profile/${video.user._id}`}>
                        <Image
                          className={cx('user-avatar')}
                          src={video.user.avatar}
                          alt={'Avatar'}
                        />
                      </Link>
                      <div className={cx('user-name-container')}>
                        <Link to={`/profile/${video.user._id}`}>
                          <h3 className={cx('user-name')}> {video.user.nickname}</h3>
                        </Link>
                        <h4 className={cx('user-nickname')}>
                          {video.user.name}
                          <span style={{ margin: '0px 4px' }}> · </span>
                          <span className={cx('user-upload-date')}>
                            {formatDistanceToNow(video.createdAt)}
                          </span>
                        </h4>
                      </div>
                    </div>
                  </HeadlessTippy>
                </div>
                <Button
                  className={cx({
                    'follow-btn': !currentUser?.following.includes(video.user._id),
                    'unfollow-btn': currentUser?.following.includes(video.user._id),
                  })}
                  primary
                  onClick={handleFollowClick}
                >
                  {currentUser?.following.includes(video.user._id)
                    ? `${t('following')}`
                    : `${t('follow')}`}
                </Button>
              </div>
              <div className={cx('video-description')}>
                <div className={cx('video-caption')}>{video.description}</div>
                <div className={cx('video-sound')}>
                  <FontAwesomeIcon icon={faMusic} />
                  <span>&nbsp;{t('sound')} -&nbsp;</span>
                  <span className={cx('user-nickname')}>{video.user.nickname}</span>
                </div>
              </div>
            </div>
            <div className={cx('video-data-container')}>
              <div className={cx('video-data')}>
                <div className={cx('video-action-list')}>
                  <div className={cx('video-action-btn')}>
                    <VideoActionButton
                      small
                      icon={faHeart}
                      clickedColor="rgb(254, 44, 85)"
                      isClicked={video?.likes.includes(currentUser?._id) ? true : false}
                      onClick={handleLikeClick}
                    />
                    <span className={cx('video-like-counter')}>{video.likesCount}</span>
                  </div>
                  <div className={cx('video-action-btn')}>
                    <VideoActionButton
                      small
                      noIcon
                      icon={faCommentDots}
                      onClick={handleCommentClick}
                    />
                    <span className={cx('video-comment-counter')}>{video.commentsCount}</span>
                  </div>
                  <div className={cx('video-action-btn')}>
                    <VideoActionButton
                      small
                      icon={faBookmark}
                      clickedColor="rgb(250,206,21)"
                      isClicked={video?.favorites.includes(currentUser?._id) ? true : false}
                      onClick={handleFavoriteClick}
                    />
                    <span className={cx('video-save-counter')}>{video.favorites.length}</span>
                  </div>
                </div>

                <div className={cx('video-share-list')}>
                  <Tippy content={t('actions.embed')} placement="top">
                    <Link
                      to={``}
                      className={cx('video-share-btn')}
                      style={{ backgroundColor: 'rgb(81, 82, 90)' }}
                    >
                      <FontAwesomeIcon icon={faCode} />
                    </Link>
                  </Tippy>

                  <Tippy content={t('actions.sendToFriends')} placement="top">
                    <Link
                      to={``}
                      className={cx('video-share-btn')}
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </Link>
                  </Tippy>

                  <Tippy content={t('actions.facebook')} placement="top">
                    <Link
                      to={``}
                      className={cx('video-share-btn')}
                      style={{ backgroundColor: 'rgb(0, 117, 250)' }}
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </Link>
                  </Tippy>

                  <Tippy content={t('actions.whatsapp')} placement="top">
                    <Link
                      to={``}
                      className={cx('video-share-btn')}
                      style={{ backgroundColor: 'rgb(37, 211, 102)' }}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </Link>
                  </Tippy>

                  <Tippy content={t('actions.twitter')} placement="top">
                    <Link
                      to={``}
                      className={cx('video-share-btn')}
                      style={{ backgroundColor: 'rgb(29, 161, 242)' }}
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </Link>
                  </Tippy>

                  <Tippy content={t('actions.share')} placement="top">
                    <Link to={``} className={cx('video-share-btn')}>
                      <FontAwesomeIcon icon={faShare} />
                    </Link>
                  </Tippy>
                </div>
              </div>
              <div className={cx('video-copy-link')}>
                <p className={cx('copy-link-text')} ref={pageURLRef}>
                  {pageURL}
                </p>
                <button className={cx('copy-link-btn')} onClick={handleCopyURLClick}>
                  Copy link
                </button>
              </div>
            </div>
          </div>
          <div className={cx('video-tab-menu')}>
            <div className={cx('video-tab-container')}>
              <div
                className={cx('video-tab', { active: showComments })}
                onClick={() => setShowComments(true)}
              >
                {t('comments')}{' '}
                <span className={cx('video-comment-count')}>({video.commentsCount})</span>
              </div>
              <div
                className={cx('video-tab', { active: !showComments })}
                onClick={() => setShowComments(false)}
              >
                {t('creatorVideos')}
              </div>
            </div>
            <div className={cx('video-tab-border')}></div>
          </div>
          {showComments &&
            (!isLoading ? (
              <Comments comments={comments} setComments={setComments} />
            ) : (
              <LoadingIcon commentFirstLoad />
            ))}
        </div>
      </div>
      {!showComments && <CreatorVideos video={video} />}
      {showComments &&
        (currentUser ? (
          <form onSubmit={handleCommentSubmit} method="POST" autoComplete="off">
            <div className={cx('comment-box')}>
              <div className={cx('comment-input-container')}>
                <input
                  ref={commentInputRef}
                  type="text"
                  className={cx('comment-input')}
                  placeholder={t('addComment')}
                  onChange={handleCommentChange}
                  name="comment"
                  id="comment"
                />
                <div className={cx('comment-option')}>
                  <span className={cx('comment-option-btn')}>
                    <FontAwesomeIcon icon={faAt} />
                  </span>
                  <span className={cx('comment-option-btn')}>
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                extraSmall
                className={cx('comment-post-btn', {
                  active: !commentDisable,
                })}
                onClick={handleCommentSubmit}
                disabled={commentDisable}
              >
                {t('postComment')}
              </Button>
            </div>
          </form>
        ) : (
          <div className={cx('no-user-text')}>Please log in to post comment</div>
        ))}
    </div>
  );
}

VideoInfo.propTypes = {
  video: PropTypes.object,
};

export default VideoInfo;
