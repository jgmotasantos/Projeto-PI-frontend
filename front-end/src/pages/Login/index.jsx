import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function TelaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        alert("Login realizado com sucesso!");
        navigate("/empresas");
      } else {
        setErro(data.detail || "Erro ao fazer login.");
      }
    } catch {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <h1>Welcome back!</h1>
          <p>Enter your Credentials to access your account</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember for 30 days
              </label>
            </div>

            <button type="submit">Login</button>
            {erro && <p style={{ color: "red" }}>{erro}</p>}

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