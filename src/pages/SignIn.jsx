import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ArrowRightIconUrl from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIconUrl from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"


function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData
  const navigate = useNavigate()
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      navigate('/')
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error("Invalid User Credentials")
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
     </header>

      <form onSubmit={onSubmit}>
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
      
        <Link to="/forgot-password" className="forgotPasswordLink">
          Forgot Password?
        </Link>
        
        <div className="signInBar">
          <p className="signInText">Sign In</p>
          <button className="signInButton">
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

      <Link to="/sign-up" className="registerLink">
        Sign Up Instead
      </Link>
    </div>
  
  )
}

export default SignIn
