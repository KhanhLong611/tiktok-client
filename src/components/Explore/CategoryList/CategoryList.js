import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import styles from './CategoryList.module.scss';

const cx = classNames.bind(styles);
function CategoryList({ activeCategory, onCategoryChange }) {
  const { t } = useTranslation('explore');

  const categories = [
    `${t('dancing')}`,
    `${t('comedy')}`,
    `${t('sports')}`,
    `${t('anime')}`,
    `${t('shows')}`,
    `${t('dailyLife')}`,
    `${t('beauty')}`,
    `${t('games')}`,
    `${t('cars')}`,
    `${t('food')}`,
    `${t('animal')}`,
    `${t('fitness')}`,
  ];

  return (
    <div className={cx('category-list-container')}>
      <div className={cx('category-list')}>
        <div className={cx('categories')}>
          {categories.map((category, index) => (
            <div key={index} className={cx('category-button-container')}>
              <div
                className={cx('category-button', { active: category === activeCategory })}
                onClick={() => {
                  onCategoryChange(category);
                }}
              >
                {category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

CategoryList.propTypes = {
  activeCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
};

export default CategoryList;
