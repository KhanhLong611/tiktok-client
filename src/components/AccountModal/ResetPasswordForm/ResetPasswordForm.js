import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import styles from './ResetPasswordForm.module.scss';
import { loginSuccess } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function ResetPasswordForm({ onSignUpClick }) {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSendTokenDisabled, setIsSentTokenDisabled] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [sendTokenMessage, setSendTokenMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const dispatch = useDispatch();

  const { t } = useTranslation('authentication');

  useEffect(() => {
    if (email.trim() !== '' && password.trim() !== '' && passwordConfirm.trim() !== '') {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, passwordConfirm]);

  useEffect(() => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    if (emailRegex.test(email)) {
      setIsSentTokenDisabled(false);
    } else {
      setIsSentTokenDisabled(true);
    }
  }, [email]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSendTokenMessage('');
  };

  const handleResetTokenChange = (e) => {
    setResetToken(e.target.value);
    setSubmitMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setSubmitMessage('');
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    setSubmitMessage('');
  };

  const handleSendResetToken = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/forgotPassword`,
        {
          email,
        },
        { withCredentials: true },
      );

      setSendTokenMessage(data.message);
    } catch (error) {
      setSendTokenMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `/users/resetPassword/${resetToken}`,
        {
          password,
          passwordConfirm,
        },
        { withCredentials: true },
      );
      setSubmitMessage(t('resetSuccessMessage'));
      setTimeout(() => {
        dispatch(loginSuccess(data.data.user));
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSubmitMessage(error.response.data.message);
    }
  };

  return (
    <div className={cx('form-container')}>
      <form action="">
        <div className={cx('form-main')}>
          <h2 className={cx('form-title')}>{t('resetPassword')}</h2>
          <div className={cx('input-name')}>{t('enterEmail')}</div>
          <input
            className={cx('input-field')}
            type="email"
            placeholder={t('emailAddress')}
            name="email"
            required
            value={email}
            onInput={handleEmailChange}
            id="email"
          />
          {sendTokenMessage && <div className={cx('form-token-error')}>{sendTokenMessage}</div>}
          <div className={cx('form-reset-token')}>
            <input
              className={cx('input-field')}
              type="text"
              placeholder={t('enterResetToken')}
              name="resetToken"
              required
              value={resetToken}
              onInput={handleResetTokenChange}
              id="resetToken"
              style={{ paddingRight: '126px' }}
            />
            <button
              className={cx('send-token-btn')}
              onClick={handleSendResetToken}
              disabled={isSendTokenDisabled}
            >
              {t('sendResetToken')}
            </button>
          </div>
          <input
            className={cx('input-field')}
            type="password"
            placeholder={t('password')}
            name="password"
            required
            value={password}
            onInput={handlePasswordChange}
            id="password"
            minLength={8}
          />
          <input
            className={cx('input-field')}
            type="password"
            placeholder={t('passwordConfirm')}
            name="passwordConfirm"
            required
            value={passwordConfirm}
            onInput={handlePasswordConfirmChange}
            id="passwordConfirm"
            minLength={8}
          />
          {submitMessage && <div className={cx('form-submit-error')}>{submitMessage}</div>}
          <button
            className={cx('submit-btn')}
            type="submit"
            disabled={isSubmitDisabled}
            onClick={handleResetPassword}
          >
            {t('resetPassword')}
          </button>
        </div>
        <div className={cx('form-footer')}>
          <span className={cx('form-footer-text')}>{t('noAccountMessage')}</span>
          <div className={cx('form-footer-link')} onClick={onSignUpClick}>
            {t('signup')}
          </div>
        </div>
      </form>
    </div>
  );
}

ResetPasswordForm.propTypes = {
  onSignUpClick: PropTypes.func,
};

export default ResetPasswordForm;
