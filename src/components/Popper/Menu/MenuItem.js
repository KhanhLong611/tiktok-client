import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Menu.module.scss';

import { changeTheme } from '../../../redux/themeSlice';
import Button from '../../../components/Button';
import ToggleButton from '../../../components/ToggleButton/ToggleButton';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick, toggle }) {
  const classes = cx('menu-item', {
    separate: data.separate, // button nào có separate là có vạch ở dưới
  });

  const { isLightTheme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleChangeThemeClick = () => {
    dispatch(changeTheme());
  };

  // Hook to apply theme attribute when isLightTheme changes
  useEffect(() => {
    const applyThemeAttribute = () => {
      const allElements = document.querySelectorAll('*');

      allElements.forEach((element) => {
        if (!isLightTheme) {
          element.setAttribute('data-theme', 'dark');
        } else {
          element.removeAttribute('data-theme');
        }
      });
    };
    applyThemeAttribute();
  }, [isLightTheme]);

  return (
    <div className={cx('menu-item-container')}>
      <Button className={classes} leftIcon={data.icon} to={data.to} onClick={onClick}>
        {data.title}
        {toggle && (
          <ToggleButton
            className="menu-toggle-btn"
            state={!isLightTheme}
            onClick={handleChangeThemeClick}
          />
        )}
      </Button>
    </div>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  toggle: PropTypes.bool,
};

export default MenuItem;
