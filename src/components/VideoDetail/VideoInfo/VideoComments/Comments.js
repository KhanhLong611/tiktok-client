import classNames from 'classnames/bind';

import styles from './Comments.module.scss';
import Comment from './Comment/Comment';

const cx = classNames.bind(styles);

function Comments({ comments, setComments }) {
  return (
    <div className={cx('comments-container')}>
      {comments.map((comment) => {
        return (
          <Comment key={comment._id} data={comment} comments={comments} setComments={setComments} />
        );
      })}
    </div>
  );
}

export default Comments;
