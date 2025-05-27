import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./negocio.css";

function DetalhesNegocio() {
  const { id } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [aba, setAba] = useState("tarefas");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/negocios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNegocio(data))
      .catch(() => setNegocio(null));
  }, [id]);

  if (!negocio) return <p>Carregando negócio...</p>;

  return (
    <div className="detalhes-container">
      <div className="col-esquerda">
        <div className="header-esquerda">
          <h2>{negocio.titulo}</h2>
          <div className="icones-empresa">
            <FaEdit title="Editar" />
            <FaTrash title="Excluir" style={{ marginLeft: "10px" }} />
          </div>
        </div>
        <p><strong>Empresa:</strong> {negocio.empresa?.nome || "—"}</p>
        <p><strong>Valor:</strong> R$ {negocio.valor ? parseFloat(negocio.valor).toFixed(2) : "—"}</p>
        <p><strong>Fechamento:</strong> {negocio.fechamento || "—"}</p>
        <p><strong>Status:</strong> {negocio.status}</p>
        <p><strong>Fabricante:</strong> {negocio.fabricante || "—"}</p>
        <p><strong>Solução:</strong> {negocio.solucao}</p>
      </div>

      <div className="col-central">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="abas">
            <span className={aba === "tarefas" ? "ativa" : ""} onClick={() => setAba("tarefas")}>Tarefas</span>
            <span className={aba === "observacoes" ? "ativa" : ""} onClick={() => setAba("observacoes")}>Observações</span>
            <span className={aba === "reunioes" ? "ativa" : ""} onClick={() => setAba("reunioes")}>Reuniões</span>
          </div>
          <button className="nova-btn">Criar nova tarefa</button>
        </div>

        <div className="conteudo-aba">
          {aba === "tarefas" && <p>Tarefas vinculadas ao negócio.</p>}
          {aba === "observacoes" && <p>Observações internas.</p>}
          {aba === "reunioes" && <p>Reuniões com o cliente.</p>}
        </div>
      </div>

      <div className="col-direita">
        <h4>Empresas ({negocio.empresa ? 1 : 0})</h4>
        {negocio.empresa && (
          <div className="item-card">
            <strong>{negocio.empresa.nome}</strong>
            <p>{negocio.empresa.dominio}</p>
            <p>{negocio.empresa.cnpj}</p>
          </div>
        )}

        <h4>Contatos ({negocio.contato ? 1 : 0})</h4>
        {negocio.contato && (
          <div className="item-card">
            <strong>{negocio.contato.nome}</strong>
            <p>{negocio.contato.email}</p>
            <p>{negocio.contato.telefone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalhesNegocio;
