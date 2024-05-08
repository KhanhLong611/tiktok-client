import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import styles from './SignUpForm.module.scss';
import { loginSuccess } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function SignUpForm({ onLogInClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const { t } = useTranslation('authentication');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  useEffect(() => {
    if (email.trim() !== '' && password.trim() !== '' && passwordConfirm.trim() !== '') {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, passwordConfirm]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/v1/users/signup',
        {
          email,
          password,
          passwordConfirm,
        },
        { withCredentials: true },
      );
      setMessage(t('createAccountSuccess'));
      setTimeout(() => {
        dispatch(loginSuccess(data.data.user));
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.error.message);
    }
  };

  return (
    <div className={cx('form-container')} method="POST" autoComplete="off">
      <div className={cx('form-main')}>
        <h2 className={cx('form-title')}>{t('signup')}</h2>
        <div className={cx('input-name')}>{t('email')}</div>
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
        <div className={cx('input-name')}>{t('password')}</div>

        <input
          className={cx('input-field')}
          type="password"
          placeholder={t('password')}
          name="password"
          required
          minLength={8}
          value={password}
          onInput={handlePasswordChange}
          id="password"
        />
        <input
          className={cx('input-field')}
          type="password"
          placeholder={t('passwordConfirm')}
          name="passwordConfirm"
          required
          minLength={8}
          value={passwordConfirm}
          onInput={handlePasswordConfirmChange}
          id="passwordConfirm"
        />
        {message && <div className={cx('form-error')}>{message}</div>}
        <button
          className={cx('submit-btn')}
          type="submit"
          disabled={isSubmitDisabled}
          onClick={handleSignUp}
        >
          {t('signup')}
        </button>
        <div className={cx('form-main-text')}>{t('policyText')}</div>
      </div>

      <div className={cx('form-footer')}>
        <span className={cx('form-footer-text')}>{t('haveAccountMessage')}</span>
        <div className={cx('form-footer-link')} onClick={onLogInClick}>
          {t('login')}
        </div>
      </div>
    </div>
  );
}

SignUpForm.propTypes = {
  onLogInClick: PropTypes.func,
};

export default SignUpForm;
