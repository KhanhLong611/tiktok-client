import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';

import classNames from 'classnames/bind';

import styles from './Comment.module.scss';
import Image from '../../../../Image';

const cx = classNames.bind(styles);

function Comment({ data, comments, setComments }) {
  const [showMore, setShowMore] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const { t } = useTranslation('videoDetail');

  const deleteComment = async () => {
    if (currentUser) {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        const res = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/comments/${data._id}`,
        );

        if (res.status === 200) {
          setComments(
            comments.filter((comment) => {
              return comment._id !== data._id;
            }),
          );
          window.alert('Comment deleted successfully!');
        }
      }
    } else {
      window.alert('Please log in to delete your comment.');
    }
  };

  const renderDeleteComment = (attrs) => {
    return (
      <div tabIndex="-1" {...attrs}>
        <div className={cx('more-btn-wrapper')}>
          <div className={cx('delete-btn')} onClick={deleteComment}>
            <FontAwesomeIcon icon={faTrashCan} className={cx('delete-btn-icon')} />
            <span className={cx('delete-btn-text')}>{t('delete')}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderReportComment = (attrs) => {
    return (
      <div tabIndex="-1" {...attrs}>
        <div className={cx('more-btn-wrapper')}>
          <div className={cx('report-btn')}>
            <span>{t('report')}</span>
          </div>
        </div>
      </div>
    );
  };

  const showMoreButton = () => {
    setShowMore(true);
  };

  const hideMoreButton = () => {
    setShowMore(false);
  };

  return (
    <div className={cx('comment-item-container')}>
      <div
        className={cx('comment-container')}
        onMouseEnter={showMoreButton}
        onMouseLeave={hideMoreButton}
      >
        <Link to={`/profile/${data.user.id}`}>
          <Image className={cx('user-avatar')} src={data.user.avatar} alt={'Avatar'} />
        </Link>
        <div className={cx('user-comment')}>
          <Link to={`/profile/${data.user.id}`} className={cx('user-name-link')}>
            <h3 className={cx('user-name')}>{data.user.nickname}</h3>
          </Link>
          <div className={cx('user-comment-content')}>{data.content}</div>
          <div className={cx('user-comment-more')}>
            <span className={cx('user-upload-date')}>{formatDistanceToNow(data.createdAt)}</span>
            <span className={cx('reply-btn')}>{t('reply')}</span>
          </div>
        </div>
        <div className={cx('like-container')}>
          <div className={cx('more-btn', { visible: showMore })}>
            <HeadlessTippy
              interactive
              zIndex={2}
              placement="bottom"
              render={data.user._id === currentUser._id ? renderDeleteComment : renderReportComment}
            >
              <div>
                <FontAwesomeIcon icon={faEllipsis} />
              </div>
            </HeadlessTippy>
          </div>
          <div className={cx('like-btn')}>
            <FontAwesomeIcon icon={faHeart} />
          </div>
          {/* <span className={cx('like-counter')}>0</span> */}
        </div>
      </div>
      {/* <div className={cx('reply-container')}>
        <div className={cx('show-reply-btn')}>View 123 replies</div>
        <FontAwesomeIcon icon={faChevronDown} />
      </div> */}
    </div>
  );
}

Comment.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Comment;
