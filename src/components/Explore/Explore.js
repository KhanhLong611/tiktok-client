// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Explore.module.scss';

import CategoryList from './CategoryList';
import VideoList from './VideoList';

const cx = classNames.bind(styles);

function Explore() {
  const [activeCategory, setActiveCategory] = useState('Dancing');

  const [searchParams] = useSearchParams();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Set initial active tab according to query parameters
  useEffect(() => {
    const activeTab = searchParams.get('active') || 'dancing';

    setActiveCategory(activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
  }, [searchParams]);

  return (
    <div className={cx('wrapper')}>
      <CategoryList activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      <VideoList key={activeCategory} category={activeCategory} />
    </div>
  );
}

export default Explore;
