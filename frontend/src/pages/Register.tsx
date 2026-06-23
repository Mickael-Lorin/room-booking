import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../services/AuthService';

export const Register: REACT.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'USER' //Valeur par défaut
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await registerService(formData);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input name="firstName" placeholder="Prénom" onChange={handleChange} required />
            <input name="lastName" placeholder="Nom" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />

            <button type="submit">S'inscrire</button>
        </form>
    );
};