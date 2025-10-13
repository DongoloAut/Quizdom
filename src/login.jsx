import React from 'react';
import './login.css';

function Login() {
    return (
    <div className="wrapper"> 
        <form action="">
            <h1>Login</h1>

            <div className="input-box">
                <input type="text" placeholder="Username" required />
                <i className='bx bx-user'></i>
            </div>

            <div className="input-box">
                <input type="password" placeholder="Password" required />
                <i className='bx bx-lock'></i>
            </div>

            <button type="submit" className="btn">Login</button>

            <div className="remember-forgot">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
            </div>

            
            
            <div className="register-link">
                <p>Don't have an account? <a href="#">Register</a></p>
            </div>

        </form>
    </div>
  )
}
export default Login;