import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './LoginForm.module.scss';
import { useEffect, useState } from 'react';
import { loginFailure, loginStart, loginSuccess } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function LoginForm({ onSignupClick, onForgotClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation('authentication');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(loginSuccess(data.data.user));
    } catch (error) {
      setError(error.response.data.message);
      dispatch(loginFailure(error.response.data.message));
    }
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (emailRegex.test(email) && email.trim() !== '' && password.trim() !== '') {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password]);

  return (
    <div className={cx('form-container')}>
      <form action="">
        <div className={cx('form-main')}>
          <h2 className={cx('form-title')}>{t('login')}</h2>
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
          {error && <div className={cx('form-error')}>{error}</div>}
          <div className={cx('form-main-link')} onClick={onForgotClick}>
            {t('forgotPassword')}
          </div>
          <button
            className={cx('submit-btn')}
            type="submit"
            disabled={isSubmitDisabled}
            onClick={handleLogin}
          >
            {t('login')}
          </button>
        </div>
        <div className={cx('form-footer')}>
          <span className={cx('form-footer-text')}>{t('noAccountMessage')}</span>
          <div className={cx('form-footer-link')} onClick={onSignupClick}>
            {t('signup')}
          </div>
        </div>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  onSignupClick: PropTypes.func,
  onForgotClick: PropTypes.func,
};

export default LoginForm;
