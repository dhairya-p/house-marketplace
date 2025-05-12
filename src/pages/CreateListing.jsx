import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase.config"
import { doc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  })

  const {type, name, bedrooms, bathrooms, parking, furnished, offer, regularPrice, discountedPrice, images, latitude, longitude} = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: doc(db, 'users', user.uid)
          })
        } else {
          navigate('/sign-in')
       }
      })
    }
  }, [navigate, auth])

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Create a Listing</p>
      </header>
      <main>
        <form className="form" onSubmit={onSubmit}>
          <label className="formLabel">Rent / Sell</label>
          <div className="formButtons">
            <button type="button" className={type === 'rent' ? 'formButtonActive' : 'formButton'} onClick={() => setFormData({...formData, type: 'rent'})}>Rent</button>
            <button type="button" className={type === 'sell' ? 'formButtonActive' : 'formButton'} onClick={() => setFormData({...formData, type: 'sell'})}>Sell</button>
          </div>
          <label className="formLabel">Name</label>
          <input type="text" className="formInputName" value={name} onChange={onMutate} placeholder="Name" id="name" />
        </form>
      </main>
    </div>
  )
}

export default CreateListing
