import { getAuth, updateProfile } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import deleteIcon from "../assets/svg/deleteIcon.svg"
import editIcon from "../assets/svg/editIcon.svg"

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

  const onLogout = () => {
    auth.signOut()
    navigate('/')
    toast.success("Logged out successfully")
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
        
        <div className="profileListings">
          <p className="profileListingsText">Your Listings</p>
          <ul className="profileListingsList">
              <li className="profileListingsListItem">
              <p>House</p>
              <p>For Sale</p>
              <p>2 days ago</p>
              <img src={deleteIcon} alt="delete" />
              <img src={editIcon} alt="edit" />
            </li>
          </ul>
        </div>
      </main>
    </div>)
}

export default Profile
