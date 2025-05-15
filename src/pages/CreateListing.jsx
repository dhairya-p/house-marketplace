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
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  })

  const {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude} = formData

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
    let boolean = null
    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }
    
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Boolean/Number
    if (!e.target.files) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: boolean ?? e.target.value
    }))
  }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Check for errors
    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('Discounted price must be lower than regular price')
      return
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error('Maximum of 6 images')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
      const res = await fetch (
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
      )
      const data = await res.json()

      console.log(data)

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
      location = data.status === 'ZERO_RESULTS' ? undefined: data.results[0].formatted_address
      if (location === undefined || location.includes('undefined')) {
        setLoading(false)
        toast.error('Invalid address')
        return
      }
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
      location = address
    }

    setLoading(false)
    toast.success('Listing created successfully')
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
            <button id='type' value='rent' type="button" className={type === 'rent' ? 'formButtonActive' : 'formButton'} onClick={onMutate}>Rent</button>
            <button id='type' value='sale' type="button" className={type === 'sale' ? 'formButtonActive' : 'formButton'} onClick={onMutate}>Sell</button>
          </div>


          {/* Name */}
          <label className="formLabel">Name</label>
          <input
            className='formInputName'
            maxLength='32'
            minLength='10'
            required
            type="text"
            value={name}
            onChange={onMutate}
            placeholder="Name"
            id="name"
          />

          {/* Bedrooms and Bathrooms */}
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                placeholder="Bedrooms"
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                placeholder="Bathrooms"
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          {/* Parking */}
          <label className="formLabel">Parking</label>
          <div className="formButtons">
            <button
              type="button"
              id="parking"
              value="true"
              className={parking ? "formButtonActive" : "formButton"}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              id="parking"
              value="false"
              className={!parking ? "formButtonActive" : "formButton"}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          {/* Furnished */}
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              type="button"
              id="furnished"
              value="true"
              className={furnished ? "formButtonActive" : "formButton"}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              id="furnished"
              value="false"
              className={!furnished ? "formButtonActive" : "formButton"}
              onClick={onMutate}
            >
              No
            </button>
          </div>


          {/* Address */}
          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            placeholder="Address"
            required
          />

          {!geolocationEnabled && (
              <div className="formLatLng flex">
                <div>
                  <label className="formLabel">Latitude</label>
                  <input
                    className="formInputSmall"
                    type="number" 
                    id="latitude" 
                    value={latitude} 
                    onChange={onMutate} 
                    placeholder="Latitude" 
                    required 
                  />
                </div>
                <div>
                  <label className="formLabel">Longitude</label>
                  <input
                    className="formInputSmall"
                    type="number" 
                    id="longitude" 
                    value={longitude} 
                    onChange={onMutate} 
                    placeholder="Longitude" 
                    required 
                  />
                </div>
              </div>
            )
          }
          
          {/* Offer */}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              type="button"
              className={offer ? 'formButtonActive' : 'formButton'}
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={!offer ? 'formButtonActive' : 'formButton'}
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          {/* Regular Price */}
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === 'rent' && <p className="formPriceText">$ / Month</p>}
          </div>

          {/* Discounted Price */}
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <div className="formPriceDiv">
                <input
                  className="formInputSmall"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
                {type === 'rent' && <p className="formPriceText">$ / Month</p>}
              </div>
            </>
          )}

          {/* Image Upload */}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">The first image will be the cover (max 6).</p>
          <input
              className="formInputFile"
              type="file"
              id="images"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
          />

          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button> 
        </form>
      </main>
    </div>
  )
}

export default CreateListing
