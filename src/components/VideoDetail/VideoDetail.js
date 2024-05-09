import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
// import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import styles from './VideoDetail.module.scss';
import { fetchSuccess, resetVideo } from '../../redux/videoSlice';

import Video from './Video';
import VideoInfo from './VideoInfo';
import LoadingIcon from '../LoadingIcon';

const cx = classNames.bind(styles);

function VideoDetail() {
  const { currentVideo } = useSelector((state) => state.video);

  const location = useLocation();
  const scrollState = location.state?.scrollPosition;
  const from = location.state?.from;

  const videoId = useParams().id;
  const dispatch = useDispatch();

  useEffect(() => {
    let ignore = false;
    const fetchVideo = async () => {
      try {
        const video = (
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/find/${videoId}`)
        ).data.data.document;
        if (!ignore) {
          dispatch(fetchSuccess(video));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideo();
    return () => {
      dispatch(resetVideo());
      ignore = true;
    };
  }, [videoId, dispatch]);

  if (currentVideo) {
    return (
      <div className={cx('wrapper')}>
        <Video video={currentVideo} scrollState={scrollState} from={from} />
        <VideoInfo video={currentVideo} />
      </div>
    );
  } else {
    return <LoadingIcon browserFirstLoad />;
  }
}

// VideoDetail.propTypes = {};

export default VideoDetail;
