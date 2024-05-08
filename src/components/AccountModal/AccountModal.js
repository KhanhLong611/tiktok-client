import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountModal.module.scss';
import { forwardRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ResetPasswordForm from './ResetPasswordForm';

const cx = classNames.bind(styles);

const AccountModal = forwardRef((props, ref) => {
  const [form, setForm] = useState('login');

  const handleCloseModal = () => {
    ref.current.className = cx('leave');
    setTimeout(() => {
      ref.current.close();
      ref.current.className = '';
    }, 200);
    setTimeout(() => {
      setForm('login');
    }, 220);
  };

  return (
    <dialog ref={ref}>
      <div className={cx('login-modal-container')}>
        <div className={cx('login-modal-header')}>
          <div className={cx('login-modal-close')} onClick={handleCloseModal}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <div className={cx('login-modal-form')}>
          {form === 'login' && (
            <LoginForm
              form={form}
              onSignupClick={() => {
                setForm('signup');
              }}
              onForgotClick={() => {
                setForm('forgotPassword');
              }}
            />
          )}
          {form === 'signup' && (
            <SignUpForm
              onLogInClick={() => {
                setForm('login');
              }}
            />
          )}
          {form === 'forgotPassword' && (
            <ResetPasswordForm
              onSignUpClick={() => {
                setForm('signup');
              }}
            />
          )}
        </div>
      </div>
    </dialog>
  );
});

AccountModal.propTypes = {
  props: PropTypes.object,
};

export default AccountModal;
