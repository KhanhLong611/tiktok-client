import { useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  faCircleQuestion,
  faCoins,
  faEarthAsia,
  faEllipsisVertical,
  faGear,
  faKeyboard,
  faSignOut,
  faUser,
  faPlus,
  faBookmark,
  faMoon,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';

import { logout } from '../../../redux/userSlice';
import Button from '../../../components/Button';
import styles from './Header.module.scss';
import images from '../../../assets/images';
import Menu from '../../../components/Popper/Menu';
import InboxPanel from './InboxPanel';
import { InboxIcon, MessageIcon, DesktopAppIcon } from '../../../components/Icons';
import Image from '../../../components/Image';
import Search from '../Search';
import AccountModal from '../../../components/AccountModal';

const cx = classNames.bind(styles);

function Header() {
  const [showInboxPanel, setShowInboxPanel] = useState(false);
  const loginRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const { isLightTheme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const { i18n } = useTranslation();
  const { t } = useTranslation('header');

  const MENU_ITEM = useMemo(
    () => [
      {
        icon: <FontAwesomeIcon icon={faLightbulb} />,
        title: `${t('menuItems.live')}`,
        to: '/live-creator-hub',
      },
      {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: `${t('menuItems.language.languageTitle')}`,
        children: {
          title: `${t('menuItems.language.languageTitle')}`,
          data: [
            {
              type: 'languages',
              code: 'en',
              title: `${t('menuItems.language.languageItem.en')}`,
            },
            {
              type: 'languages',
              code: 'vi',
              title: `${t('menuItems.language.languageItem.vi')}`,
            },
          ],
        },
      },
      {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: `${t('menuItems.feedback')}`,
        to: '/feedback',
      },
      {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: `${t('menuItems.keyboard')}`,
      },
      {
        icon: <FontAwesomeIcon icon={faMoon} />,
        title: `${t('menuItems.darkMode')}`,
        type: 'theme',
        toggle: true,
      },
    ],
    [t],
  );

  const userMenu = useMemo(
    () => [
      {
        icon: <FontAwesomeIcon icon={faUser} />,
        title: `${t('menuItems.profile')}`,
        to: `/profile/${currentUser?._id}`,
      },
      {
        icon: <FontAwesomeIcon icon={faBookmark} />,
        title: `${t('menuItems.favorites')}`,
        to: `/profile/${currentUser?._id}?active=favorites`,
      },
      { ...MENU_ITEM[0] },
      {
        icon: <FontAwesomeIcon icon={faCoins} />,
        title: `${t('menuItems.coins')}`,
        to: '/coin',
      },
      {
        icon: <FontAwesomeIcon icon={faGear} />,
        title: `${t('menuItems.settings')}`,
        to: '/settings',
      },
      ...MENU_ITEM.slice(1),
      {
        icon: <FontAwesomeIcon icon={faSignOut} />,
        title: `${t('menuItems.logout')}`,
        separate: true,
        type: 'logout',
      },
    ],
    [MENU_ITEM, currentUser?._id, t],
  );

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/?new=true');
    } else {
      // Reload the page without any query parameters
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const handleLoginClick = () => {
    loginRef.current.showModal();
  };

  const handleInboxPanelClick = () => {
    setShowInboxPanel(!showInboxPanel);
  };

  const changeLanguage = useCallback(
    (lng) => {
      i18n.changeLanguage(lng);
    },
    [i18n],
  );

  // Handle logic on menu buttons
  const handleMenuChange = useCallback(
    (menuItem) => {
      switch (menuItem.type) {
        case 'languages':
          changeLanguage(menuItem.code);
          break;
        case 'theme':
          console.log('change theme');
          break;
        case 'logout':
          try {
            const loggingout = async () => {
              await axios.get('/api/v1/users/logout', { withCredentials: true });
            };
            loggingout();
            dispatch(logout());
          } catch (error) {}
          break;
        default:
      }
    },
    [changeLanguage, dispatch],
  );

  return (
    <header className={cx('wrapper')}>
      <div className={cx('inner')}>
        <div onClick={handleLogoClick} className={cx('logo-link')}>
          {isLightTheme ? (
            <img src={images.logo} alt="TikTok"></img>
          ) : (
            <img src={images.darkThemeLogo} alt="TikTok"></img>
          )}
        </div>

        <Search />

        <div className={cx('actions')}>
          {currentUser ? (
            <>
              <Button
                href={'/upload'}
                className={cx('upload-btn')}
                leftIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                {t('uploadBtn')}
              </Button>
              <Tippy delay={[0, 200]} content={t('desktopBtn')} placement="bottom">
                <button className={cx('action-btn')}>
                  <DesktopAppIcon />
                </button>
              </Tippy>
              <Tippy delay={[0, 200]} content={t('messageBtn')} placement="bottom">
                <button className={cx('action-btn')}>
                  <MessageIcon />
                  <span className={cx('badge')}>1</span>
                </button>
              </Tippy>
              <InboxPanel
                visible={showInboxPanel}
                hide={() => {
                  setShowInboxPanel(false);
                }}
              >
                <div>
                  <Tippy delay={[0, 200]} content={t('inboxBtn')} placement="bottom">
                    <button className={cx('action-btn')} onClick={handleInboxPanelClick}>
                      <InboxIcon />
                      <span className={cx('badge')}>2</span>
                    </button>
                  </Tippy>
                </div>
              </InboxPanel>
            </>
          ) : (
            <>
              <Button
                className={cx('upload-btn')}
                onClick={handleLoginClick}
                leftIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                {t('upload')}
              </Button>

              <Button onClick={handleLoginClick} primary>
                {t('login')}
              </Button>

              <AccountModal ref={loginRef} />
            </>
          )}

          <Menu items={currentUser ? userMenu : MENU_ITEM} onChange={handleMenuChange}>
            {currentUser ? (
              <Image
                className={cx('user-avatar')}
                src={currentUser.avatar}
                alt={currentUser.name}
              />
            ) : (
              <button className={cx('more-btn')}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
