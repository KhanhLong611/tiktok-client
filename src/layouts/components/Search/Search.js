import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import { Wrapper as PopperWrapper } from '../../../components/Popper';
import { SearchIcon } from '../../../components/Icons';
import AccountItem from '../../../components/AccountItem';
import styles from './Search.module.scss';
import useDebounce from '../../../hooks/useDebounce';

const cx = classNames.bind(styles);

function Search({ border, transparent }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 800);

  const inputRef = useRef();

  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResults = () => {
    setShowResults(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { t } = useTranslation('header');

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);

      const result = await axios.get(`/api/v1/users/search?q=${debouncedValue}`);

      const users = result.data.data.users;
      setSearchResult(users);

      setLoading(false);
    };

    fetchApi();
  }, [debouncedValue]);

  return (
    // Use a wrapper <div> or <span> tag to fix Tippy's warning
    <div>
      <HeadlessTippy
        interactive
        visible={showResults && searchResult.length > 0}
        render={(attrs) => (
          <div className={cx('search-result')} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <h4 className={cx('search-title')}>{t('search.searchTitle')}</h4>
              {searchResult.map((result) => (
                <AccountItem key={result._id} data={result} />
              ))}
            </PopperWrapper>
          </div>
        )}
        onClickOutside={handleHideResults}
      >
        <div
          className={cx('search', {
            border: border,
          })}
        >
          <input
            ref={inputRef}
            value={searchValue}
            placeholder={t('search.searchPlaceholder')}
            spellCheck={false}
            onChange={handleChange}
            onFocus={() => setShowResults(true)}
            className={cx({ transparent: transparent })}
          />
          {!!searchValue && !loading && (
            <button className={cx('clear', { transparent: transparent })} onClick={handleClear}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}
          {loading && (
            <FontAwesomeIcon
              className={cx('loading', { transparent: transparent })}
              icon={faSpinner}
            />
          )}

          <button
            className={cx('search-btn', {
              transparent: transparent,
            })}
            onMouseDown={handleSubmit}
          >
            <SearchIcon />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
