import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { Wrapper as PopperWrapper } from '../../components/Popper';
import styles from './SuggestedAccounts.module.scss';
import AccountPreview from './AccountPreview/AccountPreview';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
  const renderPreview = (attrs) => {
    return (
      <div tabIndex="-1" {...attrs}>
        <PopperWrapper>
          <AccountPreview data={data} />
        </PopperWrapper>
      </div>
    );
  };

  return (
    <div>
      <Link to={`/profile/${data._id}/`}>
        <Tippy
          interactive
          offset={[-20, 0]}
          delay={[800, 0]}
          render={renderPreview}
          placement="bottom"
        >
          <div className={cx('account-item')}>
            <img src={data.avatar} alt={data.nickname} className={cx('avatar')} />
            <div className={cx('item-info')}>
              <p className={cx('nickname')}>
                <strong>{data.nickname}</strong>
                <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
              </p>
              <p className={cx('username')}>{data.name}</p>
            </div>
          </div>
        </Tippy>
      </Link>
    </div>
  );
}

AccountItem.propTypes = {
  data: PropTypes.object,
};

export default AccountItem;
