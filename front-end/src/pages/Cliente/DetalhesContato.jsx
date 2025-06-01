import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./cliente.css";


function DetalhesContato() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contato, setContato] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [aba] = useState("tarefas");
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [erro, setErro] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    telefone: "",
    email: "",
    empresa_id: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/contatos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setContato(data);
        setFormulario({
          nome: data.nome || "",
          telefone: data.telefone || "",
          email: data.email || "",
          empresa_id: data.empresa?.id || ""
        });
      });

    fetch("http://localhost:8000/empresas/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data || []));
  }, [id]);

  const handleAtualizar = () => {
    if (!formulario.nome || !formulario.empresa_id) {
      setErro(true);
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/contatos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formulario,
        empresa_id: parseInt(formulario.empresa_id),
      }),
    })
      .then(() => {
        setMostrarEdicao(false);
        window.location.reload();
      });
  };

  const handleExcluir = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/contatos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => navigate("/contatos"));
  };

  if (!contato) return <p>Carregando contato...</p>;

  return (
    <div className="detalhes-container">
      {/* COLUNA ESQUERDA */}
      <div className="col-esquerda">
        <div className="header-esquerda">
          <h2>{contato.nome}</h2>
          <div className="icones-empresa">
            <FaEdit title="Editar" onClick={() => setMostrarEdicao(true)} />
            <FaTrash title="Excluir" style={{ marginLeft: "10px" }} onClick={() => setConfirmarExclusao(true)} />
          </div>
        </div>
        <p><strong>Email:</strong> {contato.email}</p>
        <p><strong>Telefone:</strong> {contato.telefone}</p>
      </div>

      {/* COLUNA CENTRAL */}
      <div className="col-central">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="abas">

          </div>
        </div>

        <div className="conteudo-aba">
          {aba === "tarefas" && <p>Tarefas relacionadas ao contato.</p>}
          {aba === "observacoes" && <p>Observações internas sobre o contato.</p>}
          {aba === "reunioes" && <p>Reuniões com o contato.</p>}
        </div>
      </div>

      {/* COLUNA DIREITA */}
      <div className="col-direita">
        <h4>Empresas ({contato.empresa ? 1 : 0})</h4>
        {contato.empresa ? (
          <div className="item-card">
            <strong>{contato.empresa.nome}</strong>
            <p>CNPJ: {contato.empresa.cnpj}</p>
          </div>
        ) : (
          <p>Nenhuma empresa associada.</p>
        )}

        <h4>Negócios ({contato.negocios?.length || 0})</h4>
        {contato.negocios?.map((n) => (
          <div key={n.id} className="item-card">
            <strong>{n.titulo}</strong>
            <p>Status: {n.status}</p>
            <p>Valor: R$ {n.valor ? parseFloat(n.valor).toFixed(2) : "—"}</p>
          </div>
        ))}
      </div>

      {/* MODAL DESLIZANTE DE EDIÇÃO */}
      {mostrarEdicao && (
        <div className={`slide-form open`}>
          <div className="slide-header">
            <h3>Editar contato</h3>
            <button className="fechar" onClick={() => setMostrarEdicao(false)}>×</button>
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
            value={formulario.nome}
            onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
          />

          <label>Telefone</label>
          <input
            className="campo"
            type="text"
            value={formulario.telefone}
            onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })}
          />

          <label>Email</label>
          <input
            className="campo"
            type="email"
            value={formulario.email}
            onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
          />

          <label data-required="*">Empresa</label>
          <select
            className="campo"
            value={formulario.empresa_id}
            onChange={(e) => setFormulario({ ...formulario, empresa_id: e.target.value })}
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>

          <div className="slide-actions">
            <button className="cancelar" onClick={() => setMostrarEdicao(false)}>Cancelar</button>
            <button className="criar" onClick={handleAtualizar}>Salvar</button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmarExclusao && (
        <div className="overlay-confirmacao">
          <div className="janela-confirmacao-central">
            <h4>Deseja realmente excluir este contato?</h4>
            <div className="botoes">
              <button className="confirmar" onClick={handleExcluir}>Sim, excluir</button>
              <button className="cancelar" onClick={() => setConfirmarExclusao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalhesContato;
