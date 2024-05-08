import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ToggleButton.module.scss';

const cx = classNames.bind(styles);

function ToggleButton({ className, onClick, state }) {
  return (
    <div className={cx(className)}>
      <label className={cx('switch')} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={state} onChange={onClick} />
        <span className={cx('slider', 'round')}></span>
      </label>
    </div>
  );
}

ToggleButton.propTypes = {
  classNames: PropTypes.string,
  onClick: PropTypes.func,
};

export default ToggleButton;
