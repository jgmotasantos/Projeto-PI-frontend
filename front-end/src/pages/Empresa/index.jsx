import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./empresa.css";

function TelaEmpresa() {
  const [empresas, setEmpresas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [mostrarSlide, setMostrarSlide] = useState(false);
  const [erroCampos, setErroCampos] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    dominio: "",
    cnpj: "",
    area_atuacao: "",
    num_funcionarios: "",
    fabricante: "",
    contato_associado_id: "",
    negocio_associado_id: "",
    criador_id: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/empresas/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(Array.isArray(data) ? data : []));

    fetch("http://localhost:8000/contatos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setContatos(data.contatos || []));
  }, []);

  const handleCadastro = async () => {
    const obrigatorios = ["nome", "dominio", "cnpj", "area_atuacao", "num_funcionarios", "criador_id"];
    const algumVazio = obrigatorios.some((campo) => !form[campo]);

    if (algumVazio) {
      setErroCampos(true);
      return;
    }

    setErroCampos(false);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/empresas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        num_funcionarios: parseInt(form.num_funcionarios),
        contato_associado_id: form.contato_associado_id || null,
        negocio_associado_id: form.negocio_associado_id || null,
      }),
    });

    if (res.ok) {
      const nova = await res.json();
      setEmpresas([...empresas, nova]);
      setMostrarSlide(false);
      setForm({
        nome: "",
        dominio: "",
        cnpj: "",
        area_atuacao: "",
        num_funcionarios: "",
        fabricante: "",
        contato_associado_id: "",
        negocio_associado_id: "",
        criador_id: 1,
      });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Empresas</h2>
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
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Domínio</th>
              <th>Funcionários</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/empresas/${e.id}`} style={{ color: "#0d1f60", textDecoration: "underline" }}>
                    {e.nome}
                  </Link>
                </td>
                <td>{e.cnpj}</td>
                <td>{e.dominio}</td>
                <td>{e.num_funcionarios}</td>
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

        {erroCampos && (
          <p style={{ color: "red", marginBottom: "10px", fontWeight: "bold" }}>
            Preencha todos os campos obrigatórios marcados com *
          </p>
        )}

        <label data-required="*">Nome da Empresa</label>
        <input className="campo" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />

        <label data-required="*">Domínio</label>
        <input className="campo" type="text" value={form.dominio} onChange={(e) => setForm({ ...form, dominio: e.target.value })} />

        <label data-required="*">CNPJ</label>
        <input className="campo" type="text" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />

        <label data-required="*">Área de Atuação</label>
        <input className="campo" type="text" value={form.area_atuacao} onChange={(e) => setForm({ ...form, area_atuacao: e.target.value })} />

        <label data-required="*">Nº de Funcionários</label>
        <input className="campo" type="number" value={form.num_funcionarios} onChange={(e) => setForm({ ...form, num_funcionarios: e.target.value })} />

        <label>Fabricante</label>
        <input className="campo" type="text" value={form.fabricante} onChange={(e) => setForm({ ...form, fabricante: e.target.value })} />

        <label>Contato Associado</label>
        <select
          className="campo"
          value={form.contato_associado_id}
          onChange={(e) => setForm({ ...form, contato_associado_id: e.target.value })}
        >
          <option value="">Nenhum</option>
          {contatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} ({c.email})
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

export default TelaEmpresa;
