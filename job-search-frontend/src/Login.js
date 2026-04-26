import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 1. Obyektin içində 'username' yox, 'email' olmalıdır
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend-ə birbaşa credentials göndərilir
            const res = await axios.post('http://localhost:8080/api/auth/login', credentials);

            localStorage.setItem('user', JSON.stringify(res.data));
            alert("Xoş gəldiniz!");
            window.location.href = "/";
        } catch (err) {
            // Xətanı konsolda görək ki, backend nə deyir
            console.error(err);
            alert("Email və ya şifrə yanlışdır!");
        }
    };

    return (
        <div className="auth-fullscreen-overlay">
            <div className="auth-card">
                <h2>🔐 Giriş Et</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Gmail ünvanınız"
                        required
                        // 2. Buradakı credentials.email yazılışı useState ilə eyni olmalıdır
                        onChange={e => setCredentials({...credentials, email: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Şifrə"
                        required
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                    />
                    <button type="submit" className="btn-submit">Daxil Ol</button>
                </form>
                <p onClick={() => navigate('/register')} className="auth-link">
                    Hesabınız yoxdur? Qeydiyyatdan keçin
                </p>
            </div>
        </div>
    );
};

export default Login;