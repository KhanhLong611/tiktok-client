// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './EditProfileForm.module.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

import app from '../../../utils/firebase';
import useDebounce from '../../../hooks/useDebounce';
import { updateUser } from '../../../redux/userSlice';
import Image from '../../Image';
import Button from '../../Button';

const cx = classNames.bind(styles);

function EditProfileForm({ closeEditProfileForm }) {
  const [img, setImg] = useState();
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const debouncedNickname = useDebounce(nickname, 800);

  const handleImageChange = (e) => {
    e.preventDefault();
    if (e.target.files[0] !== undefined) {
      setImg(e.target.files[0]);
      setIsDisabled(false);
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setHasChanged(true);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + img.name;
        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, img);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',
          (snapshot) => {
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
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          },
        );
      });
    };

    if (!isDisabled) {
      setIsSubmitting(true);
      let imgUrl;
      if (img) {
        imgUrl = await uploadImage();
      }

      const updateData = {
        nickname: nickname.trim(),
        name: name.trim(),
        bio: bio.trim(),
      };

      if (imgUrl) {
        updateData.avatar = imgUrl;
      }

      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/updateMe`,
        updateData,
      );

      const user = res.data.data.user;
      dispatch(updateUser(user));

      setIsSubmitting(false);
      setIsDisabled(true);

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      return;
    }
  };

  const handleCancelChange = (e) => {
    e.preventDefault();

    if (!isDisabled) {
      const res = window.confirm('Are you sure you want to cancel all changes?');
      if (res) {
        closeEditProfileForm();
      } else return;
    } else {
      closeEditProfileForm();
    }
  };

  // Set default values for input fields
  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.nickname);
      setName(currentUser.name);
      setBio(currentUser.bio);
    }
  }, [currentUser]);

  // Listen for changes from nickname field
  useEffect(() => {
    if (hasChanged && debouncedNickname !== currentUser.nickname) {
      const validateNickname = async () => {
        setIsChecking(true);

        // Regular expression to match allowed characters (letters, numbers, underscores, and periods)
        const validRegex = /^[a-zA-Z0-9_.]+$/;

        const trimmedNickname = debouncedNickname.trim();

        if (trimmedNickname === '') {
          setWarningMessage('Please enter a nickname.');
          setIsValid(false);
        } else if (trimmedNickname.length < 3) {
          setWarningMessage('Nickname must be at least 3 characters long.');
          setIsValid(false);
        } else if (trimmedNickname.length > 30) {
          setWarningMessage('Nickname cannot exceed 30 characters.');
          setIsValid(false);
        } else if (!validRegex.test(trimmedNickname)) {
          setWarningMessage(
            'Nickname can only contain letters, numbers, underscores, and periods.',
          );
          setIsValid(false);
        } else {
          try {
            const response = await axios.get(
              `${
                process.env.REACT_APP_BACKEND_URL
              }/api/v1/users/checkNicknameDuplicate?nickname=${encodeURIComponent(
                trimmedNickname,
              )}`,
            );
            const data = response.data;

            if (data.isDuplicate) {
              setWarningMessage('This nickname is already taken. Please choose another nickname.');
              setIsValid(false);
            } else {
              setWarningMessage('');
              setIsValid(true);
            }
          } catch (error) {
            console.error('Error checking nickname duplicate:', error);
            setWarningMessage('An error occurred while checking nickname. Please try again.');
            setIsValid(false);
          }
        }

        setIsChecking(false);
      };

      validateNickname();
    } else if (debouncedNickname === currentUser.nickname) {
      // Fake checking nickname duplicate
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false); //
        setIsValid(true);
      }, 800);
    }
  }, [debouncedNickname, hasChanged, currentUser.nickname]);

  // Able form submit when on of the input values has changed and username is valid
  useEffect(() => {
    if (
      isValid &&
      nickname &&
      name &&
      bio &&
      (nickname.trim() !== currentUser.nickname) |
        (name.trim() !== currentUser.name) |
        (bio.trim() !== currentUser.bio)
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [isValid, currentUser.name, name, currentUser.nickname, nickname, currentUser.bio, bio]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('edit-profile-form')}>
        <div className={cx('edit-profile-form-header')}>
          <div className={cx('form-header-title')}>Edit Profile</div>
          <div className={cx('form-header-close-btn')} onClick={handleCancelChange}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <div className={cx('edit-profile-form-body')}>
          <div className={cx('form-avatar')}>
            <div className={cx('form-item-label')}>Profile Photo</div>
            <label htmlFor="imageInput" className={cx('upload-label')}>
              <div className={cx('user-avatar-container')}>
                <Image
                  className={cx('user-avatar')}
                  src={img ? URL.createObjectURL(img) : currentUser.avatar}
                  alt=""
                />
              </div>
              <span className={cx('image-upload-icon')}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </span>
            </label>
            <input
              onInput={handleImageChange}
              required
              type="file"
              id="imageInput"
              name="image"
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>
          <div className={cx('form-username')}>
            <div className={cx('form-item-label')}>Username</div>
            <div className={cx('username-input-container')}>
              <div className={cx('username-input-box')}>
                <input
                  className={cx('username-input', { 'not-valid': !isValid })}
                  required
                  type="text"
                  name="username"
                  placeholder="Username"
                  defaultValue={nickname}
                  onInput={handleNicknameChange}
                />
                <div className={cx('username-input-icon')}>
                  {hasChanged && isChecking && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      color="gray"
                      className={cx('input-icon-spinner')}
                    />
                  )}
                  {hasChanged && !isChecking && isValid && (
                    <FontAwesomeIcon icon={faCheck} color="green" />
                  )}
                </div>
              </div>

              {!isValid && <div className={cx('form-warning')}>{warningMessage}</div>}
              {/* <div className={cx('user-page-url')}>www.tiktok.com/@</div> */}
              <div className={cx('form-description')}>
                Usernames can only contain letters, numbers, underscores, and periods.
              </div>
            </div>
          </div>
          <div className={cx('form-name')}>
            <div className={cx('form-item-label')}>Name</div>
            <div className={cx('name-input-container')}>
              <input
                className={cx('name-input')}
                required
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={name}
                onInput={handleNameChange}
              />
              <div className={cx('form-description')}>
                Your name can only be changed once every 7 days.
              </div>
            </div>
          </div>
          <div className={cx('form-bio')}>
            <div className={cx('form-item-label')}>Bio</div>
            <div className={cx('bio-input-container')}>
              <textarea
                className={cx('bio-input')}
                placeholder="Bio"
                defaultValue={bio}
                maxLength={80}
                onInput={handleBioChange}
              />
              <div className={cx('bio-counter-container', 'form-description')}>{bio.length}/80</div>
            </div>
          </div>
        </div>
        <div className={cx('edit-profile-form-footer')}>
          <Button className={cx('form-cancel-btn')} onClick={handleCancelChange}>
            Cancel
          </Button>
          <Button
            className={cx('form-submit-btn', {
              disabled: isDisabled,
            })}
            primary={!isDisabled && !isSubmitting && !isChecking}
            disabled={isDisabled || isSubmitting || isChecking}
            onClick={handleSubmitForm}
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSpinner} color="red" className={cx('input-icon-spinner')} />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileForm;
