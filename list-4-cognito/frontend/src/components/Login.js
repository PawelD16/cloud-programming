import React, { useState } from 'react';
import { signIn } from "aws-amplify/auth"

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await signIn(email, password);
            console.log('Login successful:', user);
            onLoginSuccess(user);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}


export default Login;
