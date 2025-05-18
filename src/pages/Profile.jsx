import { getAuth, updateProfile } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { updateDoc, doc, deleteDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../firebase.config"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem"

function Profile() {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const { name, email } = formData
  const [changeDetails, setChangeDetails] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState(null)

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        updateDoc(userRef, {
          name
        })
      }
      
      toast.success("Profile details updated successfully")
    }
    catch (error) {
      toast.error("Could not update profile details")
    }
  }

  useEffect(() => {
    if (auth.currentUser) {
      setFormData({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
      })
    }
  }
    , [auth])



  useEffect(() => {
    const fetchUserListings = async () => {
      setLoading(true)
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"))
      const querySnap = await getDocs(q)
      const listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])


  const onLogout = () => {
    auth.signOut()
    navigate('/')
    toast.success("Logged out successfully")
  }

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)
      setListings(updatedListings)
      toast.success("Listing deleted successfully")
    }
  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input className={changeDetails ? 'profileNameActive' : 'profileName'} type="text" id="name" value={name} disabled={!changeDetails} onChange={onChange}
            />
            <p className="profileEmail"
              id="email">
              {email} 
            </p>
          </form>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password?
          </Link>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your property</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id} 
                  listing={listing.data} 
                  id={listing.id} 
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                /> 
              ))}

            </ul>
          </>
        )}
      </main>
    </div>)
}

export default Profile
