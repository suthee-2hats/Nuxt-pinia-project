
import type {
    User,
    SignInCredentials,
    SignUpData,
  } from '~/types/user'
  
  export const signInUser = (credentials: SignInCredentials) => {
    return $fetch<User>('/api/auth/login', {
      method: 'POST',
      body: credentials,
      credentials: 'include',
    })
  }
  
  export const signUpUser = (data: SignUpData) => {
    const { confirmPassword, ...registrationData } = data
  
    return $fetch<User>('/api/auth/register', {
      method: 'POST',
      body: registrationData,
      credentials: 'include',
    })
  }
  
  export const signOutUser = () => {
    return $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  }
  