import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import GoogleIconUrl from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // Check if user already exists in Firestore
      const docRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(docRef)
      if (!userDoc.exists()) {
        // User does not exist, create a new document
        const formDataCopy = {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        }
        await setDoc(docRef, formDataCopy)
      }
      // User exists, or document created successfully
      navigate('/')
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error('Could not log in with Google')
    }
  }
  
  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      {/* Google icon */}
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={GoogleIconUrl} alt="google" />
      </button>
    </div>
  )
}

export default OAuth
