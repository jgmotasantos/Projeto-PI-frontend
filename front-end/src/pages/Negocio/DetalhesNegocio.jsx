import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./negocio.css";

function DetalhesNegocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negocio, setNegocio] = useState(null);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [aba, setAba] = useState("tarefas");
  const [form, setForm] = useState({
    titulo: "",
    solucao: "",
    fabricante: "",
    fechamento: "",
    valor: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/negocios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setNegocio(data);
        setForm({
          titulo: data.titulo || "",
          solucao: data.solucao || "",
          fabricante: data.fabricante || "",
          fechamento: data.fechamento || "",
          valor: data.valor || "",
        });
      });
  }, [id]);

  const handleSalvar = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/negocios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        valor: parseFloat(form.valor),
      }),
    }).then(() => {
      setMostrarEdicao(false);
      window.location.reload();
    });
  };

  const handleExcluir = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/negocios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/negocios"));
  };

  if (!negocio) return <p>Carregando...</p>;

  return (
    <div className="detalhes-container">
      {/* ESQUERDA */}
      <div className="col-esquerda">
        <div className="header-esquerda">
          <h2>{negocio.titulo}</h2>
          <div className="icones-empresa">
            <FaEdit title="Editar" onClick={() => setMostrarEdicao(true)} />
            <FaTrash title="Excluir" style={{ marginLeft: "10px" }} onClick={() => setConfirmarExclusao(true)} />
          </div>
        </div>
        <p><strong>Status:</strong> {negocio.status}</p>
        <p><strong>Valor:</strong> R$ {parseFloat(negocio.valor).toFixed(2)}</p>
        <p><strong>Fechamento:</strong> {negocio.fechamento || "—"}</p>
      </div>

      {/* CENTRAL */}
      <div className="col-central">
        <div className="abas">
          <button
            className={aba === "tarefas" ? "aba ativa" : "aba"}
            onClick={() => setAba("tarefas")}
          >
            Tarefas
          </button>
          <button
            className={aba === "observacoes" ? "aba ativa" : "aba"}
            onClick={() => setAba("observacoes")}
          >
            Observações
          </button>
          <button
            className={aba === "reunioes" ? "aba ativa" : "aba"}
            onClick={() => setAba("reunioes")}
          >
            Reuniões
          </button>
        </div>

        <div className="btn-adicionar">
          {aba === "tarefas" && <button>+ Adicionar Tarefa</button>}
          {aba === "observacoes" && <button>+ Adicionar Observação</button>}
          {aba === "reunioes" && <button>+ Adicionar Reunião</button>}
        </div>

        <div className="conteudo-aba">
          {aba === "tarefas" && (
            <>
              <div className="tarefa finalizada">
                <details>
                  <summary><del>Tarefa 1: Iniciar contato com o Zezinho Barreto ✔️</del></summary>
                </details>
              </div>

              <div className="tarefa pendente">
                <details open>
                  <summary><strong>Tarefa: Marcar nova reunião para apresentação</strong></summary>
                  <p><strong>Criada por:</strong> Zezinho (AM)</p>
                  <p><strong>Prazo da tarefa:</strong> 30/03/2025 às 08:00 GMT</p>
                  <p><strong>Prioridade:</strong> <span style={{ color: 'red' }}>Alta</span></p>
                  <p><strong>Atribuída a:</strong> Zezinho (PV)</p>
                  <p><em><u>Adicionar comentário</u> 🗨️</em></p>
                </details>
              </div>
            </>
          )}

          {aba === "observacoes" && (
            <div className="observacoes">
              <p>📝 Reunião marcada com o cliente para o dia 30/03. Levar documentação técnica e proposta comercial.</p>
              <p>📌 Cliente demonstrou interesse em outras soluções da Cisco.</p>
            </div>
          )}

          {aba === "reunioes" && (
            <div className="reunioes">
              <p>📅 Reunião com Banco do Brasil — 30/03/2025 às 08:00 GMT</p>
              <p>👥 Participantes: Zezinho (AM), Zezinho (PV)</p>
              <p>🗒️ Pauta: Apresentação da solução de switches Cisco</p>
            </div>
          )}
        </div>
      </div>

      {/* DIREITA */}
      <div className="col-direita">
        <h4>Empresa</h4>
        {negocio.empresa && (
          <div className="item-card">
            <strong>{negocio.empresa.nome}</strong>
            <p>CNPJ: {negocio.empresa.cnpj}</p>
          </div>
        )}

        <h4>Contato</h4>
        {negocio.contato ? (
          <div className="item-card">
            <strong>{negocio.contato.nome}</strong>
            <p>Email: {negocio.contato.email}</p>
            <p>Telefone: {negocio.contato.telefone}</p>
          </div>
        ) : (
          <p>Nenhum contato associado</p>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {mostrarEdicao && (
        <div className="slide-form open">
          <div className="slide-header">
            <h3>Editar negócio</h3>
            <button className="fechar" onClick={() => setMostrarEdicao(false)}>×</button>
          </div>

          <label>Título</label>
          <input className="campo" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />

          <label>Solução</label>
          <input className="campo" value={form.solucao} onChange={e => setForm({ ...form, solucao: e.target.value })} />

          <label>Fabricante</label>
          <input className="campo" value={form.fabricante} onChange={e => setForm({ ...form, fabricante: e.target.value })} />

          <label>Fechamento</label>
          <input type="date" className="campo" value={form.fechamento} onChange={e => setForm({ ...form, fechamento: e.target.value })} />

          <label>Valor</label>
          <input type="number" className="campo" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />

          <div className="slide-actions">
            <button className="cancelar" onClick={() => setMostrarEdicao(false)}>Cancelar</button>
            <button className="criar" onClick={handleSalvar}>Salvar</button>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSÃO */}
      {confirmarExclusao && (
        <div className="overlay-confirmacao">
          <div className="janela-confirmacao-central">
            <h4>Deseja realmente excluir este negócio?</h4>
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

export default DetalhesNegocio;
