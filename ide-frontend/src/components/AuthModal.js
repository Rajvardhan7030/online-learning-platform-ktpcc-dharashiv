// src/components/AuthModal.js
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Password Matching Validation (Only for Registration)
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        
        // Determine the correct backend endpoint based on Login vs Register
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        // Prepare data to send (Only send required fields)
        const requestData = isLogin 
            ? { email: formData.email, password: formData.password }
            : { username: formData.username, email: formData.email, password: formData.password };

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, requestData);
            
            // On success, save user data (including the JWT) to local storage
            localStorage.setItem('ide_user', JSON.stringify(response.data));
            
            // Notify the parent App component that login was successful
            onLoginSuccess(response.data);
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <h3>{isLogin ? 'Log In' : 'Register'}</h3>
                
                {error && <p style={{ color: '#f48771', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Only show username field if registering */}
                    {!isLogin && (
                        <input 
                            type="text" placeholder="Username" required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    )}
                    <input 
                        type="email" placeholder="Email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    {!isLogin && (
                        <input 
                            type="password" placeholder="Confirm Password" required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    )}
                    <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
                </form>

                <div className="toggle-text" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                    {isLogin ? "Need an account? Register" : "Already have an account? Log in"}
                </div>
                <div className="toggle-text" style={{ color: '#aaa', marginTop: '10px' }} onClick={onClose}>
                    Cancel
                </div>
            </div>
        </div>
    );
};

export default AuthModal;