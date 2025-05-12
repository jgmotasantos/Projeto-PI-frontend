import { useEffect, useState } from "react";
import "./empresa.css";

function TelaEmpresa() {
  const [empresas, setEmpresas] = useState([]);
  const [mostrarSlide, setMostrarSlide] = useState(false);
  const [form, setForm] = useState({ nome: "", cnpj: "", telefone: "", setor: "", endereco: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/empresas/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data.empresas || []));
  }, [token]);

  const handleCadastro = async () => {
    const res = await fetch("http://localhost:8000/empresas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const nova = await res.json();
      setEmpresas([...empresas, nova]);
      setMostrarSlide(false);
      setForm({ nome: "", cnpj: "", telefone: "", setor: "", endereco: "" });
    }
  };

  return (
    <div className="empresa-container">
      <div className="empresa-header">
        <h2>Empresas</h2>
        <button className="nova-btn" onClick={() => setMostrarSlide(true)}>
          Criar nova empresa
        </button>
      </div>

      {empresas.length === 0 ? (
        <p className="nenhuma-empresa">Nenhuma Empresa cadastrada</p>
      ) : (
        <table className="empresa-tabela">
          <thead>
            <tr>
              <th>Nome da Empresa</th>
              <th>CNPJ da Empresa</th>
              <th>Última Atividade</th>
              <th>Número de Telefone</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e, i) => (
              <tr key={i}>
                <td>{e.nome}</td>
                <td>{e.cnpj}</td>
                <td>{e.atividade || "—"}</td>
                <td>{e.telefone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`slide-form ${mostrarSlide ? "open" : ""}`}>
        <div className="slide-header">
          <h3>Criar nova empresa</h3>
          <button className="fechar" onClick={() => setMostrarSlide(false)}>×</button>
        </div>
        <label>Nome da Empresa</label>
        <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />

        <label>CNPJ da Empresa</label>
        <input type="text" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />

        <label>Contato Associado</label>
        <input type="text" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />

        <label>Setor de atuação</label>
        <input type="text" value={form.setor} onChange={(e) => setForm({ ...form, setor: e.target.value })} />

        <label>Endereço</label>
        <input type="text" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />

        <div className="slide-actions">
          <button onClick={() => setMostrarSlide(false)} className="cancelar">Cancelar</button>
          <button onClick={handleCadastro} className="criar">Criar</button>
        </div>
      </div>
    </div>
  );
}

export default TelaEmpresa;