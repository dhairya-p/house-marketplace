import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ArrowRightIconUrl from '..assets/svg/keyboardArrowRightIcon.svg'
import visibilityIconUrl from '../assets/svg/visibilityIcon.svg'

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
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      const data = await response.json()
      if (response.ok) {
        // Handle successful sign-in
        console.log('Sign-in successful:', data)
        navigate('/')
      } else {
        // Handle sign-in error
        console.error('Sign-in error:', data)
      }
    } catch (error) {
      console.error('Error during sign-in:', error)
    }
  }

  
  return (
    <div>
      <h1>Sign In</h1>
    </div>
  )
}

export default SignIn
