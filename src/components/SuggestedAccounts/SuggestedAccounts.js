import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
  const [accounts, setAccounts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (currentUser) {
        const fetchedAccounts = (
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/following`)
        ).data.data.users;
        if (fetchedAccounts.length > 0) {
          setAccounts(fetchedAccounts);
        } else {
          setAccounts([]);
        }
      }
    };
    fetchAccounts();
  }, [currentUser]);

  return (
    <div className={cx('wrapper')}>
      {currentUser ? (
        <div className={cx('item-list')}>
          <p className={cx('label')}>{label}</p>
          {accounts.length === 0 ? (
            <div className={cx('no-following-text')}>
              You haven't followed anyone. Follow other users to see their accounts.
            </div>
          ) : (
            accounts.map((account) => {
              return <AccountItem key={account._id} data={account} />;
            })
          )}

          {/* <p className={cx('more-btn')}>See more</p> */}
        </div>
      ) : (
        <div className={cx('no-user-text')}>
          Log in to follow creators, like videos, and view comments.
        </div>
      )}
    </div>
  );
}

SuggestedAccounts.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SuggestedAccounts;
