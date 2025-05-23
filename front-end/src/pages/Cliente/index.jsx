import { useEffect, useState } from "react";
import "./cliente.css";

function TelaContato() {
  const [contatos, setContatos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [mostrarSlide, setMostrarSlide] = useState(false);
  const [erro, setErro] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    empresa_id: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/contatos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setContatos(data.contatos || []));

    fetch("http://localhost:8000/empresas/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data)); // ou data.empresas se vier com chave
  }, []);

  const handleCadastro = async () => {
    if (!form.nome || !form.empresa_id) {
      setErro(true);
      return;
    }

    setErro(false);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/contatos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        empresa_id: parseInt(form.empresa_id),
      }),
    });

    if (res.ok) {
      const novo = await res.json();
      setContatos([...contatos, novo]);
      setMostrarSlide(false);
      setForm({ nome: "", telefone: "", email: "", empresa_id: "" });
    }
  };

  return (
    <div className="cliente-container">
      <div className="cliente-header">
        <h2>Contatos</h2>
        <button className="novo-btn" onClick={() => setMostrarSlide(true)}>
          Criar novo contato
        </button>
      </div>

      {contatos.length === 0 ? (
        <p className="nenhuma-empresa">Nenhum contato cadastrado</p>
      ) : (
        <table className="cliente-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Empresa</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((c, i) => (
              <tr key={i}>
                <td>{c.nome}</td>
                <td>{c.email || "—"}</td>
                <td>{c.telefone || "—"}</td>
                <td>{empresas.find((e) => e.id === c.empresa_id)?.nome || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`slide-form ${mostrarSlide ? "open" : ""}`}>
        <div className="slide-header">
          <h3>Criar novo contato</h3>
          <button className="fechar" onClick={() => setMostrarSlide(false)}>×</button>
        </div>

        {erro && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Preencha os campos obrigatórios marcados com *
          </p>
        )}

        <label data-required="*">Nome</label>
        <input
          className="campo"
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <label>Telefone</label>
        <input
          className="campo"
          type="text"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />

        <label>Email</label>
        <input
          className="campo"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label data-required="*">Empresa</label>
        <select
          className="campo"
          value={form.empresa_id}
          onChange={(e) => setForm({ ...form, empresa_id: e.target.value })}
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>

        <div className="slide-actions">
          <button className="cancelar" onClick={() => setMostrarSlide(false)}>Cancelar</button>
          <button className="criar" onClick={handleCadastro}>Criar</button>
        </div>
      </div>
    </div>
  );
}

export default TelaContato;
