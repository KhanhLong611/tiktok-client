// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  // faLock,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faShareFromSquare } from '@fortawesome/free-regular-svg-icons';

import { followClick } from '../../redux/userSlice';
import VideoList from './VideoList';
import EditProfileForm from './EditProfileForm/EditProfileForm';
import Image from '../Image';
import Button from '../Button';

const cx = classNames.bind(styles);

function UserProfile() {
  const [isActive, setIsActive] = useState('videos');
  const [user, setUser] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const { t } = useTranslation('userProfile');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleMenuItemClick = (item) => {
    setIsActive(item);
  };

  const followUser = async () => {
    setIsFollowing(true);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/follow/${id}`, {
      withCredentials: true,
    });
    dispatch(followClick([id]));
  };

  const unfollowUser = async () => {
    setIsFollowing(false);
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}users/unfollow/${id}`);
    dispatch(followClick([id]));
  };

  const handleFollowClick = async () => {
    if (currentUser) {
      if (isFollowing) {
        unfollowUser();
      } else {
        followUser();
      }
    } else {
      alert('Please log in to follow this user!');
    }
  };

  // Navigate to the right active tab based on query parameter
  useEffect(() => {
    const activeTab = searchParams.get('active') || 'videos';
    if (activeTab === 'videos') {
      setIsActive('videos');
    } else if (activeTab === 'favorites') {
      setIsActive('favorites');
    } else {
      setIsActive('liked');
    }
  }, [searchParams]);

  useEffect(() => {
    const getUserData = async () => {
      const user = (
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/find/${id}`, {
          withCredentials: true,
        })
      ).data.data.document;
      setUser(user);
    };
    getUserData();
  }, [id]);

  useEffect(() => {
    if (currentUser && currentUser.following.includes(id)) {
      setIsFollowing(true);
    }
  }, [currentUser, currentUser?.following, id]);

  return (
    <div>
      <div className={cx('user-page')}>
        <div className={cx('user-data-container')}>
          <div className={cx('user-profile-container')}>
            <div className={cx('user-info-container')}>
              <div className={cx('user-avatar')}>
                <Image className={cx('user-avatar')} src={user?.avatar} alt="User's vatar" />
              </div>
              <div className={cx('user-container')}>
                <h1 className={cx('user-name')}>{user?.name}</h1>
                <h2 className={cx('user-nickname')}>{user?.nickname}</h2>
                {currentUser?._id !== id ? (
                  <div className={cx('user-action-container')}>
                    {isFollowing ? (
                      <>
                        <Button key={1} outline className={cx('user-message-btn')}>
                          {t('messages')}
                        </Button>
                        <Tippy content={t('unfollow')} placement="bottom">
                          <div className={cx('user-unfollow-btn')} onClick={handleFollowClick}>
                            <FontAwesomeIcon icon={faUserCheck} />
                          </div>
                        </Tippy>
                      </>
                    ) : (
                      <Button
                        key={2}
                        primary
                        className={cx('user-follow-btn')}
                        onClick={handleFollowClick}
                      >
                        {t('follow')}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className={cx('user-edit-profile-container')}>
                    <button className={cx('edit-profile-btn')} onClick={handleEditClick}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                      &nbsp; {t('edit')}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={cx('user-number-container')}>
              <div className={cx('user-following')}>
                <strong>{user?.followingCount}</strong>
                <span className={cx('user-number-title')}>{t('following')}</span>
              </div>
              <div className={cx('user-followers')}>
                <strong>{user?.followersCount}</strong>
                <span className={cx('user-number-title')}>{t('followers')}</span>
              </div>
              <div className={cx('user-likes')}>
                <strong>{user?.likesCount}</strong>
                <span className={cx('user-number-title')}>{t('likesCount')}</span>
              </div>
            </div>
            <div className={cx('user-bio')}>{user?.bio}</div>
            <div className={cx('user-share-container')}>
              <Tippy content={t('share')} placement="bottom">
                <div className={cx('user-share-btn')}>
                  <FontAwesomeIcon icon={faShareFromSquare} />
                </div>
              </Tippy>
              <Tippy content={t('more')} placement="bottom">
                <div className={cx('user-more-btn')}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>
              </Tippy>
            </div>
          </div>
          <VideoList
            key={isActive}
            user={user}
            isActive={isActive}
            handleMenuItemClick={handleMenuItemClick}
          />
        </div>
      </div>
      {isEditing && (
        <EditProfileForm
          closeEditProfileForm={() => {
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}

UserProfile.propTypes = {};

export default UserProfile;
