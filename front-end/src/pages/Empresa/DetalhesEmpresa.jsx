import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "./empresa.css";

function DetalhesEmpresa() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarLateral, setMostrarLateral] = useState({ esquerda: true, direita: true });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/empresas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Empresa não encontrada");
        return res.json();
      })
      .then((data) => setEmpresa(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!empresa) return <p>Carregando...</p>;

  return (
    <div className="detalhes-container">
      {/* COLUNA ESQUERDA */}
      <div className={`col-esquerda ${mostrarLateral.esquerda ? "" : "recolhida"}`}>
        <div className="header-esquerda">
          <h2>{empresa.nome}</h2>
          <div className="icones-empresa">
            <FaEdit title="Editar" style={{ cursor: "pointer" }} />
            <FaTrash title="Excluir" style={{ cursor: "pointer", marginLeft: "10px" }} />
          </div>
        </div>
        <p><strong>Domínio:</strong> {empresa.dominio}</p>
        <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
        <p><strong>Área de Atuação:</strong> {empresa.area_atuacao}</p>
        <p><strong>Funcionários:</strong> {empresa.num_funcionarios}</p>
        <p><strong>Fabricante:</strong> {empresa.fabricante || "—"}</p>
        <p><strong>ID Criador:</strong> {empresa.criador_id}</p>

        <button className="toggle-btn" onClick={() => setMostrarLateral({ ...mostrarLateral, esquerda: false })}>
          <FaChevronLeft />
        </button>
      </div>

      {!mostrarLateral.esquerda && (
        <div className="expand-btn esquerda" onClick={() => setMostrarLateral({ ...mostrarLateral, esquerda: true })}>
          <FaChevronRight />
        </div>
      )}

      {/* COLUNA CENTRAL */}
      <div className="col-central">
        <h3>Visão Geral</h3>
        <p>Atividades da empresa serão exibidas aqui em breve.</p>
      </div>

      {/* COLUNA DIREITA */}
      <div className={`col-direita ${mostrarLateral.direita ? "" : "recolhida"}`}>
        <button className="toggle-btn direita" onClick={() => setMostrarLateral({ ...mostrarLateral, direita: false })}>
          <FaChevronRight />
        </button>
        <div>
          <h4>Contatos ({empresa.contatos?.length})</h4>
          {empresa.contatos?.map((c) => (
            <div key={c.id} className="item-card">
              <p><strong>{c.nome}</strong></p>
              <p>{c.email}</p>
              <p>{c.telefone}</p>
            </div>
          ))}

          <h4>Negócios ({empresa.negocios?.length})</h4>
          {empresa.negocios?.map((n) => (
            <div key={n.id} className="item-card">
              <p><strong>{n.titulo}</strong></p>
              <p>R$ {n.valor.toFixed(2)}</p>
              <p>Status: {n.status}</p>
            </div>
          ))}
        </div>
      </div>

      {!mostrarLateral.direita && (
        <div className="expand-btn direita" onClick={() => setMostrarLateral({ ...mostrarLateral, direita: true })}>
          <FaChevronLeft />
        </div>
      )}
    </div>
  );
}

export default DetalhesEmpresa;
