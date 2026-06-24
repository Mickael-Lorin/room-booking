import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginService } from '../services/AuthService';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/rooms';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await loginService({ email, password });
            login(data.accessToken);
            navigate(redirectTo);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };
    return(
        <form onSubmit={handleSubmit}>
            <h2>Connexion</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button type="submit">Se connecter</button>
        </form>
    )
}