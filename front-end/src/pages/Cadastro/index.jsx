import { useState } from "react";
import "./cadastro.css";

function TelaCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const validarSenha = (senha) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (email !== confirmarEmail) {
      setErro("Os e-mails não coincidem.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro("A senha deve conter ao menos 8 caracteres, uma letra maiúscula e um número.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        setSucesso(true);
        setErro("");
      } else {
        setErro(data.detail || "Erro ao cadastrar.");
      }
    } catch {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <h1>Welcome to CRMConnect!</h1>
          <p className="subtitle">Enter your Credentials, so we can create your account</p>

          <form className="login-form" onSubmit={handleCadastro}>
            <label>Name</label>
            <input type="text" placeholder="Enter your name" value={nome} onChange={(e) => setNome(e.target.value)} required />

            <label>Email address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Confirm Email</label>
            <input type="email" placeholder="Confirm your email" value={confirmarEmail} onChange={(e) => setConfirmarEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)} required />

            <label>Confirm Password</label>
            <input type="password" placeholder="********" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />

            <div className="form-options">
              <label>
                <input type="checkbox" required /> I agree to the <a href="#">terms & policy</a>
              </label>
            </div>

            <button type="submit">Signup</button>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
            {sucesso && <p style={{ color: "green" }}>Cadastro realizado com sucesso!</p>}

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
