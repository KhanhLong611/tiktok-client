import UserProfile from '../../components/UserProfile';
import { useLocation } from 'react-router-dom';

function Profile() {
  const location = useLocation();
  return <UserProfile key={location.pathname} />;
}

export default Profile;
