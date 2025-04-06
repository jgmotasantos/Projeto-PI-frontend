import "./cadastro.css";

function TelaCadastro() {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <h1>Welcome to CRMConnect!</h1>
          <p className="subtitle">Enter your Credentials, so we can create your account</p>

          <form className="login-form">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />

            <label>Email address</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="********" />

            <div className="form-options">
              <label>
                <input type="checkbox" /> I agree to the <a href="#">terms & policy</a>
              </label>
            </div>

            <button type="submit">Signup</button>

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
              Have an account? <a href="/login">Sign In</a>
            </p>
          </form>
        </div>
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default TelaCadastro;
