import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import Spinner from "../components/Spinner"
import ShareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const params = useParams()
  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      } else {
        navigate('/not-found')
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }

  return <main>
    {/* SLIDER */}
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 3000 , disableOnInteraction: false }}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {listing.imgUrls.map((url, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              background: `url(${url}) center no-repeat`,
              backgroundSize: 'cover'
            }}
            className="swiperSlideDiv"
          ></div>
        </SwiperSlide>
      ))}
    </Swiper>
    {/* SHARE ICON */}
    <div 
      className="shareIconDiv" 
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => {
          setShareLinkCopied(false)
        }, 2000)
      }}
    >
      <img src={ShareIcon} alt="share" />
      <p className="shareIconText">Share</p>
    </div>
    
    {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

    {/* LISTING DETAILS */}
    <div className="listingDetails">
      <p className="listingName">{listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        {listing.type === 'rent' && ' / Month'}
      </p>
      <p className="listingLocation">{listing.location}</p>
      <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
      
      {listing.offer && (
        <p className="discountPrice">
          {'$'}
          {(listing.regularPrice - listing.discountedPrice)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          {' discount'}
        </p>
      )}

      <ul className="listingDetailsList">
        <li>
          {listing.bedrooms}
          {listing.bedrooms > 1 ? ' Bedrooms' : ' Bedroom'}
        </li>
        <li>
          {listing.bathrooms}
          {listing.bathrooms > 1 ? ' Bathrooms' : ' Bathroom'}
        </li>
        <li>
          {listing.parking && 'Parking Spot'}
        </li>
        <li>
          {listing.furnished && 'Furnished'}
        </li>
      </ul>

      <p className="listingLocationTitle">
        Location
      </p>

      <div className="leafletContainer">
        <MapContainer style={{height: '100%', width: '100%'}} 
          center={[listing.geolocation.lat, listing.geolocation.lng]} 
          zoom={13} 
          scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={[listing.geolocation.lat, listing.geolocation.lng]} 
          >
            <Popup>
              {listing.location}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      {auth.currentUser?.uid !== listing.userRef && (
        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
          Contact Landlord
        </Link>
      )}
    </div>
  </main>
}

export default Listing
