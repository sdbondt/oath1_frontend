import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthForm = () => {
    const [showLogin, setShowLogin] = useState(true)
    if (showLogin) {
      return <LoginForm setShowLogin={setShowLogin} />
    } else {
       return <SignupForm setShowLogin={setShowLogin} />
  }
};

export default AuthForm;
