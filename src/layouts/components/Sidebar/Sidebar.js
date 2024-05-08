import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Menu, { MenuItem } from './Menu';
import {
  HomeIcon,
  HomeActiveIcon,
  UserGroupIcon,
  UserGroupActiveIcon,
  CompassIcon,
  CompassActiveIcon,
  LiveIcon,
  LiveActiveIcon,
} from '../../../components/Icons';
import SuggestedAccounts from '../../../components/SuggestedAccounts/SuggestedAccounts';
import FooterItemWrapper from './Footer';
import FooterItem from './Footer/FooterItem';
import config from '../../../config';

const cx = classNames.bind(styles);

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation('sideBar');

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/?new=true');
    } else {
      // Reload the page without any query parameters for new video list
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  return (
    <aside className={cx('wrapper')}>
      <Menu>
        <MenuItem
          title={t('menuItems.forYou')}
          to={config.routes.home}
          icon={<HomeIcon />}
          activeIcon={<HomeActiveIcon />}
          onClick={handleHomeClick}
        />
        <MenuItem
          title={t('menuItems.following')}
          to={config.routes.following}
          icon={<UserGroupIcon />}
          activeIcon={<UserGroupActiveIcon />}
        />
        <MenuItem
          title={t('menuItems.explore')}
          to={config.routes.explore}
          icon={<CompassIcon />}
          activeIcon={<CompassActiveIcon />}
        />
        <MenuItem
          title={t('menuItems.live')}
          to={config.routes.live}
          icon={<LiveIcon />}
          activeIcon={<LiveActiveIcon />}
        />
      </Menu>

      <SuggestedAccounts label={t('suggested.label.following')} />

      <div className={cx('footer')}>
        <FooterItemWrapper>
          <FooterItem label={t('footer.about')} />
          <FooterItem label={t('footer.newsroom')} />
          <FooterItem label={t('footer.contact')} />
          <FooterItem label={t('footer.careers')} />
        </FooterItemWrapper>

        <FooterItemWrapper>
          <FooterItem label={t('footer.good')} />
          <FooterItem label={t('footer.advertise')} />
          <FooterItem label={t('footer.developers')} />
          <FooterItem label={t('footer.transparency')} />
          <FooterItem label={t('footer.rewards')} />
          <FooterItem label={t('footer.embeds')} />
        </FooterItemWrapper>

        <FooterItemWrapper>
          <FooterItem label={t('footer.help')} />
          <FooterItem label={t('footer.safety')} />
          <FooterItem label={t('footer.terms')} />
          <FooterItem label={t('footer.privacy')} />
          <FooterItem label={t('footer.creatorPortal')} />
          <FooterItem label={t('footer.communityGuidelines')} />
        </FooterItemWrapper>

        <p className={cx('footer-copyright')}>&#169; 2024 TikTok</p>
      </div>
    </aside>
  );
}

export default Sidebar;
