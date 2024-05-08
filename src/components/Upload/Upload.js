// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import { useRef, useState } from 'react';

import UploadBtn from './UploadBtn';
import VideoEdit from './VideoEdit';

const cx = classNames.bind(styles);

function Upload() {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('upload-container')}>
        {!uploadedVideo ? (
          <UploadBtn setUploadedVideo={setUploadedVideo} ref={inputRef} />
        ) : (
          <VideoEdit video={uploadedVideo} />
        )}
      </div>
    </div>
  );
}

Upload.propTypes = {};

export default Upload;
