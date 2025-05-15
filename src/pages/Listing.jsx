import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ShareIcon from "../assets/svg/shareIcon.svg"


function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  
  const [contactLandlord, setContactLandlord] = useState(false)

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
  } else if (listing === null) {
    return <p>Listing not found</p>
  } else {
    return (
      <div className=" no-margin">
        <div className="listingDetails">
          <p className="listingName">
            {listing.name}
            {' - $'}
            {(listing.offer ? listing.discountedPrice : listing.regularPrice)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <p className="listingLocation">{listing.location}</p>

          <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>

          {listing.offer && (
              <p className="discountPrice">
                  {'$'}
                  {(listing.regularPrice - listing.discountedPrice)
                      .toString()
                  }
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
                {listing.parking && <li>Parking Spot</li>}
                {listing.furnished && <li>Furnished</li>}
            </ul>

            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
                <div id="map"></div>
            </div>
        </div>
      </div>
    )
  }
}

export default Listing
