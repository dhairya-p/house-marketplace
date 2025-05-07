import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import ArrowRightIconUrl from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const onChange = (e) => {
    setEmail(e.target.value)
  }
  const [email, setEmail] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset link sent to your email address")
    } catch (error) {
      toast.error("Error. Failed to send reset password link")
    }
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>  
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <Link to="/sign-in" className="forgotPasswordLink">
            Go Back to Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText" onClick={onSubmit}>Send Reset Link</div>
            <button className="signInButton">
              <img src={ArrowRightIconUrl} alt="arrow right" width="34px" height="34px" filter="invert(100%)"/>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
