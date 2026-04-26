import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', user);
            alert("Qeydiyyat uğurludur! İndi giriş edə bilərsiniz.");
            navigate('/login');
        } catch (err) {
            alert("Bu istifadəçi adı artıq tutulub və ya xəta baş verdi!");
        }
    };

    return (
        <div className="auth-fullscreen-overlay">
            {/* BU DİV MÜTLƏQ OLMALIDIR */}
            <div className="auth-card">
                <h2>📝 Qeydiyyat</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="İstifadəçi adı (Məs: Nargis_Dev)"
                        required
                        onChange={e => setUser({...user, username: e.target.value})}
                    />
                    <input
                        type="email"
                        placeholder="Gmail ünvanınız (@gmail.com)"
                        required
                        onChange={e => setUser({...user, email: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Şifrə"
                        required
                        onChange={e => setUser({...user, password: e.target.value})}
                    />
                    <button type="submit" className="btn-submit">Hesab Yarat</button>
                </form>
                <p onClick={() => navigate('/login')} className="auth-link">
                    Artıq hesabınız var? Giriş edin
                </p>
            </div>
        </div>
    );
};

export default Register;