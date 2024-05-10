import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Button from '../../../components/Button/Button';
import { followClick } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function AccountPreview({ data }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFollowClick = async () => {
    if (currentUser) {
      if (currentUser.following.includes(data._id)) {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/unfollow/${data._id}`,
          { withCredentials: true },
        );
        dispatch(followClick([data._id]));
      } else {
        await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/follow/${data._id}`, {
          withCredentials: true,
        });
        dispatch(followClick([data._id]));
      }
    } else {
      alert('Please log in to follow this user!');
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <img className={cx('avatar')} src={data.avatar} alt="" />

        <Button
          className={cx({
            'follow-btn': !currentUser?.following.includes(data._id),
            'unfollow-btn': currentUser?.following.includes(data._id),
          })}
          outline
          onClick={handleFollowClick}
        >
          {currentUser?.following.includes(data._id) ? 'Following' : 'Follow'}
        </Button>
      </div>
      <div className={cx('body')}>
        <p className={cx('nickname')}>
          <strong>{data.nickname}</strong>
          <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
        </p>
        <p className={cx('username')}>{data.name}</p>
        <p className={cx('analytics')}>
          <strong className={cx('value')}>{data.followersCount} </strong>
          <span className={cx('label')}>Followers</span>
          <strong className={cx('value')}>{data.likesCount} </strong>
          <span className={cx('label')}>Likes</span>
        </p>
      </div>
    </div>
  );
}

AccountPreview.propTypes = {};

export default AccountPreview;
