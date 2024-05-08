import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './UploadBtn.module.scss';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';

import Button from '../../Button';

const cx = classNames.bind(styles);

const UploadBtn = forwardRef(({ setUploadedVideo }, ref) => {
  const { t } = useTranslation('upload');

  const handleButtonClick = (e) => {
    e.stopPropagation();
    ref.current.click();
  };

  const handleVideoChange = (e) => {
    const videoInput = ref.current;

    if (videoInput && videoInput.files.length > 0) {
      const uploadedVideo = videoInput.files[0];

      const maxSizeBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes

      if (uploadedVideo && uploadedVideo.size > maxSizeBytes) {
        alert(`${t('uploadBtn.allowSizeWarning')}`);
        e.target.value = '';
        return;
      }

      setUploadedVideo(uploadedVideo);
    }
  };

  return (
    <div onClick={handleButtonClick} className={cx('upload-btn')}>
      <input
        ref={ref}
        type="file"
        accept="video/*"
        id="fileInput"
        onChange={handleVideoChange}
      ></input>
      <div className={cx('upload-card')}>
        <FontAwesomeIcon className={cx('upload-icon')} icon={faCloudUpload} />
        <div className={cx('upload-main-text')}>{t('uploadBtn.title')}</div>
        <div className={cx('upload-sub-text')}>
          {/* <p>Or drag and drop a file</p> */}
          {t('uploadBtn.description.1')}
        </div>
        <div className={cx('upload-requirement-text')}>
          <p> {t('uploadBtn.description.2')}</p>
          <p> {t('uploadBtn.description.3')}</p>
          <p> {t('uploadBtn.description.4')}</p>
          <p> {t('uploadBtn.description.5')}</p>
        </div>
        <div>
          <Button onClick={handleButtonClick} className={cx('select-file-btn')} primary>
            {t('uploadBtn.select')}
          </Button>
        </div>
      </div>
    </div>
  );
});

UploadBtn.propTypes = {
  handleButtonClick: PropTypes.func,
  inputRef: PropTypes.any,
  handleVideoChange: PropTypes.func,
};

export default UploadBtn;
