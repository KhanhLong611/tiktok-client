import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // Import Tippy styles
import classNames from 'classnames/bind';

import { Wrapper as PopperWrapper } from '../../../../components/Popper';
import styles from './InboxPanel.module.css';
import Button from '../../../../components/Button';

const cx = classNames.bind(styles);

function CustomArrow() {
  return (
    <div
      style={{
        width: '0',
        height: '0',
        borderStyle: 'solid',
        borderWidth: '10px 10px 10px 10px',
        borderColor: 'transparent transparent white transparent',
        position: 'absolute',
        top: '-19px',
        left: 'calc(100% - 83px)',
      }}
    ></div>
  );
}

function InboxItemPanel({ onClick }) {
  const { t } = useTranslation('header');

  return (
    <>
      <div className={cx('follow-req-container')} onClick={onClick}>
        <h4 className={cx('follow-req-title')}>{t('inbox.followReq.followReqTitle')}</h4>
        <span className={cx('follow-req-hint')}>
          <span className={cx('follow-req-dot')}></span>
          <span className={cx('follow-req-number')}>5</span>
          <FontAwesomeIcon icon={faChevronRight} className={cx('follow-req-arrow')} />
        </span>
      </div>

      <div className={cx('inbox-group-container')}>
        <div className={cx('inbox-time-title')}>{t('inbox.inboxTimestamp')}</div>
        <ul className={cx('inbox-list-container')}>
          <li className={cx('inbox-item')}>
            <img className={cx('inbox-item-avatar')} src="/img/default.jpeg" alt="avatar"></img>
            <div className={cx('inbox-item-content')}>
              <Link className={cx('inbox-item-user')} to={''}>
                Heo Sữa
              </Link>
              <span className={cx('inbox-item-action')}>
                {t('inbox.inboxItemContent')}
                <span className={cx('inbox-item-date')}>9-6</span>
              </span>
            </div>
            <img
              className={cx('inbox-item-thumbnail')}
              src="/img/notification.jpg"
              alt="thumbnail"
            ></img>
          </li>
          <li className={cx('inbox-item')}>
            <img className={cx('inbox-item-avatar')} src="/img/default.jpeg" alt="avatar"></img>
            <div className={cx('inbox-item-content')}>
              <Link className={cx('inbox-item-user')} to={''}>
                Heo Sữa
              </Link>
              <span className={cx('inbox-item-action')}>
                {t('inbox.inboxItemContent')}
                <span className={cx('inbox-item-date')}>9-6</span>
              </span>
            </div>
            <img
              className={cx('inbox-item-thumbnail')}
              src="/img/notification.jpg"
              alt="thumbnail"
            ></img>
          </li>
        </ul>
      </div>
    </>
  );
}

function ShowRequestPanel({ onClick }) {
  const { t } = useTranslation('header');
  return (
    <>
      <span className={cx('follow-req-heading')} onClick={onClick}>
        <FontAwesomeIcon className={cx('follow-req-back-icon')} icon={faChevronLeft} />
        <span>{t('inbox.followReq.followReqBack')}</span>
      </span>
      <ul className={cx('follow-req-list')}>
        <li className={cx('follow-req-item')}>
          <img className={cx('follow-req-item-avatar')} src="/img/default.jpeg" alt="avatar"></img>
          <div className={cx('follow-req-item-content')}>
            <div className={cx('follow-req-item-detail')}>
              <Link className={cx('follow-req-item-user')} to={''}>
                Heo Sữa
              </Link>
              <span className={cx('follow-req-item-nickname')}>Concaheo</span>
            </div>
            <Button className={cx('follow-req-item-delete')} small>
              {t('inbox.followReq.followReqDelete')}
            </Button>
            <Button className={cx('follow-req-item-accept')} small>
              {t('inbox.followReq.followReqAccept')}
            </Button>
          </div>
        </li>
      </ul>
    </>
  );
}

function InboxPanelMain() {
  const [showRequest, setShowRequest] = useState(false);

  const { t } = useTranslation('header');

  const handleToggleShowRequest = () => {
    setShowRequest(!showRequest);
  };

  return (
    <PopperWrapper>
      <div className={cx('inbox-container')} tabIndex="-1">
        <div className={cx('inbox-header-container')}>
          <h2 className={cx('header-title')}> {t('inbox.inboxHeader')}</h2>
          <div className={cx('header-category')}>
            <Button className={cx('header-category-btn', 'active')} rounded small>
              {t('inbox.inboxTitle.all')}
            </Button>
            <Button className={cx('header-category-btn')} rounded small>
              {t('inbox.inboxTitle.likes')}
            </Button>
            <Button className={cx('header-category-btn')} rounded small>
              {t('inbox.inboxTitle.comments')}
            </Button>
            <Button className={cx('header-category-btn')} rounded small>
              {t('inbox.inboxTitle.mentionAndTags')}
            </Button>
            <Button className={cx('header-category-btn')} rounded small>
              {t('inbox.inboxTitle.followers')}
            </Button>
          </div>
        </div>

        <div className={cx('inbox-body-container')}>
          {!showRequest ? (
            <InboxItemPanel onClick={handleToggleShowRequest} />
          ) : (
            <ShowRequestPanel onClick={handleToggleShowRequest} />
          )}
        </div>
        <CustomArrow />
      </div>
    </PopperWrapper>
  );
}

const renderInboxPanel = (attrs) => {
  return (
    <div tabIndex="-1" {...attrs}>
      <InboxPanelMain />
    </div>
  );
};

function InboxPanel({ children, visible, hide }) {
  return (
    <div>
      <HeadlessTippy
        interactive
        offset={[-115, 8]}
        zIndex={2}
        visible={visible}
        render={renderInboxPanel}
        onClickOutside={hide}
      >
        {children}
      </HeadlessTippy>
    </div>
  );
}

export default InboxPanel;
