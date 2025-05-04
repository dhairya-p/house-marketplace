// Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import offerIconUrl from '../assets/svg/localOfferIcon.svg';
import exploreIconUrl from '../assets/svg/exploreIcon.svg';
import personOutlineIconUrl from '../assets/svg/personOutlineIcon.svg';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a route matches the current path
  const pathMatchRoute = (route) => {
    return route === location.pathname;
  }

  // Define colors for active/inactive text states
  const iconWidth = "36px";
  const iconHeight = "36px";

  return (
    <footer className="navbar">
      <nav className="navbarNav"> 
        <ul className="navbarListItems"> 

          {/* --- Explore Link --- */}
          <li
            key="/"
            className="navbarListItem"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={exploreIconUrl}
              alt="Explore"
              width={iconWidth}
              height={iconHeight}
            />
            
            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'} >
              Explore
            </p>
          </li>

          {/* --- Offers Link --- */}
          <li
            key="/offers"
            className="navbarListItem"
            onClick={() => navigate('/offers')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={offerIconUrl}
              alt="Offers"
              width={iconWidth}
              height={iconHeight}
            />
            <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'} >
              Offers
            </p>
          </li>

          {/* --- Profile Link --- */}
          <li
            key="/profile"
            className="navbarListItem"
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={personOutlineIconUrl}
              alt="Profile"
              width={iconWidth}
              height={iconHeight}
            />
            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'} >
              Profile
            </p>
          </li>

        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;