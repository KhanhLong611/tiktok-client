import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import axios from 'axios';

import styles from './VideoEdit.module.scss';
import Button from '../../Button';
// import ToggleButton from '../../../components/ToggleButton';
import VideoCover from './VideoCover';
import VideoPreview from './VideoPreview/VideoPreview';
import VideoUploadIcon from './VideoUploadIcon/VideoUploadIcon';
import app from '../../../utils/firebase';

const cx = classNames.bind(styles);

function VideoEdit({ video }) {
  // const [isSchedule, setIsSchedule] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [caption, setCaption] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [category, setCategory] = useState('Dancing');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const thumbnailUrlRef = useRef('');

  const videoPreviewRef = useRef(null);
  const videoCoverRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { t } = useTranslation('upload');

  const handleCaptionChange = (e) => {
    const newCaption = e.target.value;
    const trimmedCaption = newCaption.trim();
    setCaption(trimmedCaption);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  };

  const cancelUploadVideo = useCallback(() => {
    const reload = (message) => {
      alert(message);
      window.location.reload();
    };

    const userConfirm = window.confirm(`${t('videoEdit.discardWarning')}`);

    if (userConfirm) {
      if (uploadTask !== null) {
        const taskSnapshot = uploadTask.snapshot;

        if (taskSnapshot.state === 'success') {
          // Task is successfully uploaded, then delete the snapshot reference (the video itself)
          const ref = taskSnapshot.ref;
          deleteObject(ref).then(() => {
            reload(`${t('videoEdit.discardSuccess')}`);
          });
        } else {
          // Task is not uploaded yet
          uploadTask.cancel();
          reload(`${t('videoEdit.discardSuccess')}`);
        }

        setUploadTask(null);
      }
    }
  }, [uploadTask, t]);

  const uploadCoverImage = () => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + `${currentUser.nickname}`;
      const storageRef = ref(storage, 'images/' + fileName);

      // Capture current frame as cover image
      const videoCover = videoCoverRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = videoCover.videoWidth;
      canvas.height = videoCover.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoCover, 0, 0, canvas.width, canvas.height);
      const imgUrl = canvas.toDataURL();

      // Upload the image to Firebase as a data_url
      uploadString(storageRef, imgUrl, 'data_url')
        .then((snapshot) => {
          // Get the download URL of the uploaded image
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              thumbnailUrlRef.current = downloadURL;
              resolve(downloadURL);
            })
            .catch((error) => {
              console.log('Error getting download URL:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Error uploading image:', error);
          reject(error);
        });
    });
  };

  const handleUploadToDb = async (e) => {
    e.preventDefault();

    try {
      if (caption.length > 0) {
        const thumbnailURL = await uploadCoverImage();

        const data = {
          description: caption,
          videoURL: videoURL,
          thumbnailURL: thumbnailURL,
          user: currentUser._id,
          tag: category,
        };

        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos`, data);

        alert(`${t('videoEdit.uploadSuccess')}`);
        navigate(`/${currentUser.nickname}/video/${res.data.data.document._id}`);
      } else {
        alert(`${t('videoEdit.noCaptionWarning')}`);
      }
    } catch (error) {
      console.error('Error handling upload:', error);
    }
  };

  // Upload the video when there is a video
  useEffect(() => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + video.name;
    const storageRef = ref(storage, 'videos/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, video);

    setUploadTask(uploadTask);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoURL(downloadURL);
        });
      },
    );

    return () => {
      if (uploadTask !== null) {
        uploadTask.cancel();
        setUploadTask(null);
      }
    };
  }, [video]);

  return (
    <div className={cx('video-edit-container')}>
      <div className={cx('video-edit-header')}>
        <h1 className={cx('video-edit-header-title')}>{t('videoEdit.title')}</h1>
        <div className={cx('video-edit-header-text')}>{t('videoEdit.description')}</div>
      </div>
      <div className={cx('video-edit-main')}>
        {uploadPercentage < 100 ? (
          <VideoUploadIcon progressPercentage={uploadPercentage} />
        ) : (
          <VideoPreview
            videoSource={URL.createObjectURL(video)}
            caption={caption}
            ref={videoPreviewRef}
          />
        )}

        <div className={cx('video-edit-info')}>
          <div className={cx('video-caption')}>
            <div className={cx('video-edit-title')}>
              <span>{t('videoEdit.caption')}</span>
              <span className={cx('caption-length-counter')}>{caption.length}/2200</span>
            </div>
            <input
              className={cx('video-caption-input')}
              type="text"
              onInput={handleCaptionChange}
              maxLength={2200}
              placeholder=""
            ></input>
          </div>
          <div className={cx('video-cover')}>
            <div className={cx('video-edit-title')}>{t('videoEdit.cover')}</div>
            <VideoCover
              /* Creates a temporary URL that represents the video object in the browser's memory. */
              videoSrc={URL.createObjectURL(video)}
              ref={videoCoverRef}
            />
          </div>
          <div className={cx('video-category')}>
            <label htmlFor={'category'} className={cx('video-edit-title')}>
              {t('videoEdit.category')}
            </label>
            <select
              className={cx('video-category-input')}
              id="category"
              name="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="Dancing">{t('videoEdit.categoryOptions.dancing')}</option>
              <option value="Comedy">{t('videoEdit.categoryOptions.comedy')}</option>
              <option value="Sports">{t('videoEdit.categoryOptions.sports')}</option>
              <option value="Anime">{t('videoEdit.categoryOptions.anime')}</option>
              <option value="Shows">{t('videoEdit.categoryOptions.shows')}</option>
              <option value="Daily life">{t('videoEdit.categoryOptions.dailyLife')}</option>
              <option value="Beauty">{t('videoEdit.categoryOptions.beauty')}</option>
              <option value="Games">{t('videoEdit.categoryOptions.games')}</option>
              <option value="Cars">{t('videoEdit.categoryOptions.cars')}</option>
              <option value="Food">{t('videoEdit.categoryOptions.food')}</option>
              <option value="Animal">{t('videoEdit.categoryOptions.animal')}</option>
              <option value="Fitness">{t('videoEdit.categoryOptions.fitness')}</option>
            </select>
          </div>
          {/* <div className={cx('video-watcher-restrict')}>
            <label htmlFor={'people'} className={cx('video-edit-title')}>
              Who can watch this video
            </label>
            <select className={cx('watch-restrict-input')} id="people" name="people">
              <option value="Followers" defaultValue>
                Followers
              </option>
              <option value="Friends">Friends</option>
              <option value="Private">Private</option>
            </select>
          </div> */}
          {/* <div className={cx('video-action-restrict')}>
            <div className={cx('video-edit-title')}>Allow users to:</div>
            <div className={cx('action-restrict-item-container')}>
              <div className={cx('action-restrict-item')}>
                <input
                  type="checkbox"
                  id="action1"
                  name="action1"
                  defaultValue="Comment"
                  className={cx('action-restrict-checkbox')}
                ></input>
                <label className={cx('action-restrict-label')} htmlFor="action1">
                  Comment
                </label>
              </div>
              <div className={cx('action-restrict-item')}>
                <input
                  type="checkbox"
                  id="action2"
                  name="action2"
                  defaultValue="Duet"
                  className={cx('action-restrict-checkbox')}
                ></input>
                <label className={cx('action-restrict-label')} htmlFor="action2">
                  Duet
                </label>
              </div>
              <div className={cx('action-restrict-item')}>
                <input
                  type="checkbox"
                  id="action3"
                  name="action3"
                  defaultValue="Stitch"
                  className={cx('action-restrict-checkbox')}
                ></input>
                <label className={cx('action-restrict-label')} htmlFor="action3">
                  Stitch
                </label>
              </div>
            </div>
          </div> */}
          {/* <div className={cx('video-schedule')}>
            <div className={cx('video-edit-title', 'justify-start')}>
              Schedule video
              <div className={cx('video-schedule-toggle-btn')}>
                <ToggleButton onClick={() => setIsSchedule(!isSchedule)} />
              </div>
            </div>
            <div
              style={{ display: `${isSchedule ? 'block' : 'none'}` }}
              className={cx('video-schedule-input-container')}
            >
              <input className={cx('video-schedule-input')} type="date"></input>
              <input className={cx('video-schedule-input')} type="time"></input>
            </div>
          </div> */}
          <div className={cx('video-edit-confirm')}>
            <Button className={cx('discard-btn')} outline onClick={cancelUploadVideo}>
              {t('videoEdit.discard')}
            </Button>
            <Button className={cx('post-btn')} primary onClick={handleUploadToDb}>
              {/* {isSchedule ? 'Schedule' : 'Post'} */}
              {t('videoEdit.post')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoEdit.propTypes = {
  videoSrc: PropTypes.string,
};

export default VideoEdit;
