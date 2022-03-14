import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authReducer';
import ErrorModal from './UI/ErrorModal';

const SignupForm = ({ setShowLogin }) => {
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    })
    const dispatch = useDispatch()
    const showLogin = () => {
        setShowLogin(true)
    }

    const clearError = () => {
        setError(false)
    }

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const signupHandler = async (e) => {
        e.preventDefault()
        try {
            const signupBody = JSON.stringify({
                email: formData.email,
                name: formData.name,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            })
            
            const signupData = await fetch('http://localhost:5000/api/v1/auth/signup', {
                method: 'POST',
                body: signupBody,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const signupDataJSON = await signupData.json()
            if (!signupDataJSON.user || !signupDataJSON.token) {
                throw new Error(loginDataJSON.msg)
            } else {
                const { token, user } = signupDataJSON
                dispatch(authActions.login())
                dispatch(authActions.setToken(token))
                localStorage.setItem('token', JSON.stringify(token))
            }
        } catch (e) {
            const msg = e.message || 'Something went wrong'
            setError(msg)
        }
    }

    return (
        <div>
            {error && <ErrorModal message={error} onConfirm={clearError} /> }
            <h3>Sign Up</h3>
            <form onSubmit={signupHandler}>
                <label htmlFor="name">Name</label><br />
                <input onChange={changeHandler} value={formData.name} type="text" name="name" id="name" /><br />
                <label htmlFor="email">Email</label><br />
                <input onChange={changeHandler} value={formData.email} type="email" name="email" id="email" /><br />
                <label htmlFor="password">Password</label><br />
                <input onChange={changeHandler} value={formData.password} type="password" name="password" id="password" /><br />
                <label htmlFor="confirmpassword">Confirm your password</label><br />
                <input onChange={changeHandler} value={formData.confirmPassword} type="password" name="confirmPassword" id="confirmpassword" /><br />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={showLogin}>Already got an Account? Login!</button>
        </div>
  )
};

export default SignupForm;
