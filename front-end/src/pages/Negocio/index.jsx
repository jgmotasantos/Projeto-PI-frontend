import { useEffect, useState } from "react";
import "./negocio.css";

function TelaNegocio() {
  const [negocios, setNegocios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [mostrarSlide, setMostrarSlide] = useState(false);
  const [erro, setErro] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    solucao: "",
    fabricante: "",
    fechamento: "",
    valor: "",
    empresa_id: "",
    contato_id: "",
    criador_id: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/negocios/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNegocios(data || []));

    fetch("http://localhost:8000/empresas/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data || []));

    fetch("http://localhost:8000/contatos/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setContatos(data.contatos || []));
  }, []);

  const handleCadastro = async () => {
    if (!form.titulo || !form.solucao || !form.valor || !form.empresa_id) {
      setErro(true);
      return;
    }

    setErro(false);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/negocios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        valor: parseFloat(form.valor),
        empresa_id: parseInt(form.empresa_id),
        contato_id: form.contato_id ? parseInt(form.contato_id) : null,
      }),
    });

    if (res.ok) {
      const novo = await res.json();
      setNegocios([...negocios, novo]);
      setMostrarSlide(false);
      setForm({
        titulo: "",
        solucao: "",
        fabricante: "",
        fechamento: "",
        valor: "",
        empresa_id: "",
        contato_id: "",
        criador_id: 1,
      });
    }
  };

  return (
    <div className="negocio-container">
      <div className="negocio-header">
        <h2>Negócios</h2>
        <button className="novo-btn" onClick={() => setMostrarSlide(true)}>
          Criar novo negócio
        </button>
      </div>

      {negocios.length === 0 ? (
        <p className="nenhuma-empresa">Nenhum negócio cadastrado</p>
      ) : (
        <table className="negocio-tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Empresa</th>
              <th>Contato</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Fechamento</th>
            </tr>
          </thead>
          <tbody>
            {negocios.map((n, i) => (
              <tr key={i}>
                <td>{n.titulo}</td>
                <td>{empresas.find((e) => e.id === n.empresa_id)?.nome || "—"}</td>
                <td>{contatos.find((c) => c.id === n.contato_id)?.nome || "—"}</td>
                <td>R$ {parseFloat(n.valor).toFixed(2)}</td>
                <td>{n.status}</td>
                <td>{n.fechamento || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`slide-form ${mostrarSlide ? "open" : ""}`}>
        <div className="slide-header">
          <h3>Criar novo negócio</h3>
          <button className="fechar" onClick={() => setMostrarSlide(false)}>×</button>
        </div>

        {erro && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Preencha os campos obrigatórios marcados com *
          </p>
        )}

        <label data-required="*">Título</label>
        <input className="campo" type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />

        <label data-required="*">Solução</label>
        <input className="campo" type="text" value={form.solucao} onChange={(e) => setForm({ ...form, solucao: e.target.value })} />

        <label>Fabricante</label>
        <input className="campo" type="text" value={form.fabricante} onChange={(e) => setForm({ ...form, fabricante: e.target.value })} />

        <label>Data de Fechamento</label>
        <input className="campo" type="date" value={form.fechamento} onChange={(e) => setForm({ ...form, fechamento: e.target.value })} />

        <label data-required="*">Valor (R$)</label>
        <input className="campo" type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />

        <label data-required="*">Empresa</label>
        <select className="campo" value={form.empresa_id} onChange={(e) => setForm({ ...form, empresa_id: e.target.value })}>
          <option value="">Selecione uma empresa</option>
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>

        <label>Contato Associado</label>
        <select className="campo" value={form.contato_id} onChange={(e) => setForm({ ...form, contato_id: e.target.value })}>
          <option value="">Nenhum</option>
          {contatos.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} ({c.email})</option>
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

export default TelaNegocio;
