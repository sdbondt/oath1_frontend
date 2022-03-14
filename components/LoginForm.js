import React from 'react';
import { useState } from 'react';
import { useDispatch, } from "react-redux"
import { authActions } from '../store/authReducer';
import ErrorModal from '../components/UI/ErrorModal'
import { GoogleLogin } from 'react-google-login'

const LoginForm = ({ setShowLogin }) => {
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({ email: '', password: ''})
    const dispatch = useDispatch()
    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    const showSignup = () => {
        setShowLogin(false)
    }

    const clearError = () => {
        setError('')
    }

    const googleError = () => {
        setError('Google login failed')
    }

    const googleSuccess = async (res) => {
        const token = res?.tokenId
    
        try {
            dispatch(authActions.login())
            dispatch(authActions.setToken(token))
            localStorage.setItem('token', JSON.stringify(token))
        } catch (e) {
          setError(e)
        }
      }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const loginBody = JSON.stringify({
                email: formData.email,
                password: formData.password
            })
            const loginData = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                body: loginBody,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const loginDataJSON = await loginData.json()
            if (!loginDataJSON.user || !loginDataJSON.token) {
                throw new Error(loginDataJSON.msg)
            } else {
                const { token, user } = loginDataJSON
                dispatch(authActions.login())
                dispatch(authActions.setToken(token))
                localStorage.setItem('token', JSON.stringify(token))
            }
        } catch (e) {
            console.log(e)
            const msg = e.message || 'Something went wrong'
            setError(msg)
        }
        
    }

    return (
        <div>
            {
                error && <ErrorModal message={error} onConfirm={clearError} />
            }
            <h3>Login</h3>
            <form onSubmit={loginHandler}>
                <label htmlFor="email">Email</label><br />
                <input onChange={changeHandler} value={formData.email} name="email" type="email" id="email" /><br />
                <label htmlFor="password">Password</label><br />
                <input onChange={changeHandler} value={formData.password} name="password" type="password" id="password" /><br />
                <button type='submit'>Login</button>
            </form>
            <button onClick={showSignup}>No account yet? Sign up!</button>
            <GoogleLogin
                clientId="576070614964-7ae1gr90fgkq32rsqbsso8cbj1n134uo.apps.googleusercontent.com"
                render={(renderProps) => (
                    <button onClick={renderProps.onClick}
                        disabled={renderProps.disabled}     
                    >Google Login</button> 
                )}
                onSuccess={googleSuccess}
                onFailure={googleError}
                cookiePolicy="single_host_origin"
            />
        </div>
  )
};

export default LoginForm;
