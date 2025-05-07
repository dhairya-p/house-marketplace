import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config.js"
import ArrowRightIconUrl from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIconUrl from '../assets/svg/visibilityIcon.svg'
import { toast } from "react-toastify"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { name, email, password, confirmPassword } = formData
  const navigate = useNavigate()
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      delete formDataCopy.confirmPassword   // delete password and confirmPassword from db data for security reasons
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      setPasswordMatch(true)
      navigate('/')
      toast.success("Registration successful")
    } catch (error) {
      toast.error("Something went wrong with the registration")
    }

  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Create Account</p>
     </header>

      <form onSubmit={onSubmit}>
        <input 
          type="name" 
          className="nameInput" 
          placeholder="Name" 
          id="name" 
          value={name} 
          onChange={onChange} 
        />

        <input 
          type="email" 
          className="emailInput" 
          placeholder="Email" 
          id="email" 
          value={email} 
          onChange={onChange} 
        />

        <div className="passwordInputDiv">
          <input 
            type={showPassword ? "text" : "password"} 
            className="passwordInput" 
            placeholder="Password" 
            id="password" 
            value={password} 
            onChange={onChange} 
          />
          <img 
            src={visibilityIconUrl} 
            alt="show password" 
            className="showPassword" 
            onClick={() => setShowPassword((prevState) => !prevState)} 
          />
        </div>

        <div className="confirmPasswordInputDiv">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            className="passwordInput" 
            placeholder="Confirm Password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={onChange} 
          />
          <img 
            src={visibilityIconUrl} 
            alt="show confirm password" 
            className="showConfirmPassword" 
            onClick={() => setShowConfirmPassword((prevState) => !prevState)} 
          />
        </div>

        <div className="signUpBar">
          <p className="signUpText">Sign Up</p>
          <button className="signUpButton">
            <img 
              src={ArrowRightIconUrl}
              alt="arrow right"
              className="arrowRightIcon"
              onClick={onSubmit}
            />
          </button>
        </div>
      </form>

      {/* Google OAuth */}

      <Link to="/sign-in" className="registerLink">
        Already have an account? Sign In
      </Link>
    </div>
  
  )
}

export default SignUp
