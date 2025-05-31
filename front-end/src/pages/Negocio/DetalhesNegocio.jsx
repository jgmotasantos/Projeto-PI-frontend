import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaTasks,
  FaUserCircle,
  FaComments,
  FaRegClock,
} from "react-icons/fa";
import { BsCalendarEvent, BsPeopleFill } from "react-icons/bs";
import ModalCriacao from "../../components/ModalCriacao";
import { jwtDecode} from "jwt-decode";
import "./negocio.css";


function DetalhesNegocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negocio, setNegocio] = useState(null);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [aba, setAba] = useState("tarefas");
  const [tarefas, setTarefas] = useState([]);
  const [observacoes, setObservacoes] = useState([]);
  const [reunioes, setReunioes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [, setUsuarioLogadoEmail] = useState("");
  const [tarefaEditando, setTarefaEditando] = useState(null);

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

  // Decodifica o token para extrair o email do usuário autenticado
  const decoded = jwtDecode(token);
  const emailLogado = decoded.sub;

  setUsuarioLogadoEmail(emailLogado); // <- você precisa ter esse useState declarado

  fetch(`http://localhost:8000/negocios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      setNegocio(data);
      setForm({
        titulo: data.titulo || "",
        solucao: data.solucao || "",
        fabricante: data.fabricante || "",
        fechamento: data.fechamento || "",
        valor: data.valor || "",
      });
    });

  fetch(`http://localhost:8000/tarefas/negocio/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setTarefas);

  fetch(`http://localhost:8000/observacoes/negocio/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setObservacoes);

  fetch(`http://localhost:8000/reunioes/negocio/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setReunioes);
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

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setModalAberto(true);
  };

  const salvarEdicaoTarefa = async (tarefaEditada) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/tarefas/${tarefaEditando.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tarefaEditada),
  });

  if (res.ok) {
    const tarefaAtualizada = await res.json();
    setTarefas(prev =>
      prev.map(t => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t))
    );
    setTarefaEditando(null);
  }
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
          <button className={aba === "tarefas" ? "aba ativa" : "aba"} onClick={() => setAba("tarefas")}>
            <FaTasks /> Tarefas
          </button>
          <button className={aba === "observacoes" ? "aba ativa" : "aba"} onClick={() => setAba("observacoes")}>
            <FaComments /> Observações
          </button>
          <button className={aba === "reunioes" ? "aba ativa" : "aba"} onClick={() => setAba("reunioes")}>
            <BsCalendarEvent /> Reuniões
          </button>
        </div>
        <div className="btn-adicionar"> 
        <div className="conteudo-aba">
          {aba === "tarefas" && (
            <>
              <div className="botoes-criacao">
                <button onClick={() => abrirModal("tarefa")} className="btn-criar">
                  Adicionar tarefa
                </button>
              </div>
          
              {tarefas.length === 0 && <p>Nenhuma tarefa cadastrada.</p>}
              {tarefas.map(t => (
                <div className={`tarefa ${t.status === "concluida" ? "finalizada" : "pendente"}`} key={t.id}>
                  <details>
                    <summary><strong>{t.titulo}</strong></summary>
                    <p><strong>Status:</strong> {t.status}</p>
                    <p><strong>Prioridade:</strong> {t.prioridade}</p>
                    <p><strong>Prazo:</strong> {new Date(t.prazo).toLocaleDateString()}</p>
                    <p><strong>Criador:</strong> {t.criador?.nome || t.criador_id}</p>
                    <p><strong>Destinatário:</strong> {t.destinatario_rel?.nome || t.destinatario}</p>
                    <p><strong>Descrição:</strong> {t.descricao}</p>
                    {t.status !== "concluida" && (
                      <button onClick={() => setTarefaEditando(t)} className="marcar-concluida">
                        Editar
                      </button>
                    )}

                  </details>
                </div>
              ))}
            </>
          )}

          {aba === "observacoes" && (
            <>
              <div className="botoes-criacao">
                <button onClick={() => abrirModal("observacao")} className="btn-criar">
                  Adicionar observação
                </button>
              </div>
          
              {observacoes.length === 0 && <p>Nenhuma observação cadastrada.</p>}
              {observacoes.map(o => (
                <div key={o.id} className="observacao">
                  <p>{o.texto}</p>
                </div>
              ))}
            </>
          )}

          {aba === "reunioes" && (
            <>
              <div className="botoes-criacao">
                <button onClick={() => abrirModal("reuniao")} className="btn-criar">
                  Adicionar reunião
                </button>
              </div>
          
              {reunioes.length === 0 && <p>Nenhuma reunião cadastrada.</p>}
              {reunioes.map(r => (
                <div key={r.id} className="reuniao">
                  <p><strong>Data:</strong> {r.data}</p>
                  <p><strong>Hora:</strong> {r.hora}</p>
                  <p><strong>Pauta:</strong> {r.pauta}</p>
                  <p><strong>Participantes:</strong> {r.participantes}</p>
                </div>
              ))}
          </>
          )}
          {tarefaEditando && (
            <div className="form-edicao-tarefa">
              <h4>Editando: {tarefaEditando.titulo}</h4>
              <input
                type="text"
                value={tarefaEditando.titulo}
                onChange={(e) =>
                  setTarefaEditando({ ...tarefaEditando, titulo: e.target.value })
                }
              />
              <textarea
                value={tarefaEditando.descricao}
                onChange={(e) =>
                  setTarefaEditando({ ...tarefaEditando, descricao: e.target.value })
                }
              />
              <select
                value={tarefaEditando.status}
                onChange={(e) =>
                  setTarefaEditando({ ...tarefaEditando, status: e.target.value })
                }
              >
                <option value="pendente">Pendente</option>
                <option value="concluida">Concluída</option>
              </select>
              <button onClick={() => salvarEdicaoTarefa(tarefaEditando)}>Salvar</button>
              <button onClick={() => setTarefaEditando(null)}>Cancelar</button>
            </div>
          )}
        </div>
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
      {modalAberto && (
      <ModalCriacao
        tipo={tipoModal}
        negocioId={parseInt(id)}
        onClose={() => setModalAberto(false)}
        onCreated={() => window.location.reload()}
      />
    )}

    </div>
  );
}

export default DetalhesNegocio;
