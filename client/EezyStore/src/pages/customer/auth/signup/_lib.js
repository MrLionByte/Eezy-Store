import { useState } from "react";

// src/lib/signup-lib.js

export async function signupUser(formData) {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      passwordConfirm
    } = formData;
  
    if (password !== passwordConfirm) {
      throw new Error('Passwords do not match');
    }
  
    const response = await fetch('/api/auth/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        password_confirm: passwordConfirm,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      if (data.email) errorMessage = `Email: ${data.email}`;
      if (data.password) errorMessage = `Password: ${data.password}`;
      if (data.username) errorMessage = `Username: ${data.username}`;
      throw new Error(errorMessage);
    }
  
    // Return useful data
    return {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        isAdmin: false,
      },
    };
  }
  