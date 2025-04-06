import "./login.css";

function TelaLogin() {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <h1>Welcome back!</h1>
          <p>Enter your Credentials to access your account</p>

          <form className="login-form">
            <label>Email address</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="********" />

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember for 30 days
              </label>
            </div>

            <button type="submit">Login</button>

            <div className="divider">or</div>

            <div className="social-buttons">
              <button className="google">
                <img src="/assets/google-icon.png" alt="Google" />
                Sign in with Google
              </button>
              <button className="apple">
                <img src="/assets/apple-icon.png" alt="Apple" />
                Sign in with Apple
              </button>
            </div>

            <p className="signup">
            Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default TelaLogin;
