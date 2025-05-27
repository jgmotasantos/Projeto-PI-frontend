import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./negocio.css";

function DetalhesNegocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negocio, setNegocio] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [erro, setErro] = useState(false);

  const [formulario, setFormulario] = useState({
    titulo: "",
    valor: "",
    status: "",
    fabricante: "",
    solucao: "",
    data_fechamento: "",
    empresa_id: "",
    contato_id: ""
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
        setFormulario({
          titulo: data.titulo || "",
          valor: data.valor || "",
          status: data.status || "",
          fabricante: data.fabricante || "",
          solucao: data.solucao || "",
          data_fechamento: data.data_fechamento || "",
          empresa_id: data.empresa?.id || "",
          contato_id: data.contato?.id || ""
        });
      });

    fetch("http://localhost:8000/empresas/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setEmpresas);

    fetch("http://localhost:8000/contatos/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setContatos(data.contatos || []));
  }, [id]);

  const handleAtualizar = () => {
    if (!formulario.titulo || !formulario.empresa_id || !formulario.contato_id) {
      setErro(true);
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/negocios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formulario,
        empresa_id: parseInt(formulario.empresa_id),
        contato_id: parseInt(formulario.contato_id),
        valor: parseFloat(formulario.valor),
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

  if (!negocio) return <p>Carregando negócio...</p>;

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
        <p><strong>Valor:</strong> R$ {parseFloat(negocio.valor).toFixed(2)}</p>
        <p><strong>Status:</strong> {negocio.status}</p>
        <p><strong>Fabricante:</strong> {negocio.fabricante}</p>
        <p><strong>Solução:</strong> {negocio.solucao}</p>
        <p><strong>Data de Fechamento:</strong> {negocio.data_fechamento}</p>
        {negocio.empresa && (
          <>
            <hr />
            <h4>Empresa</h4>
            <p><strong>{negocio.empresa.nome}</strong></p>
            <p>{negocio.empresa.cnpj}</p>
          </>
        )}
        {negocio.contato && (
          <>
            <hr />
            <h4>Contato</h4>
            <p><strong>{negocio.contato.nome}</strong></p>
            <p>{negocio.contato.email}</p>
          </>
        )}
      </div>

      {/* CENTRAL */}
      <div className="col-central">
        <h3>Atividades futuras aqui...</h3>
      </div>

      {/* DIREITA */}
      <div className="col-direita">
        <h4>Observações</h4>
        <p>(Ainda não implementado)</p>
      </div>

      {/* EDIÇÃO */}
      {mostrarEdicao && (
        <div className={`slide-form open`}>
          <div className="slide-header">
            <h3>Editar negócio</h3>
            <button className="fechar" onClick={() => setMostrarEdicao(false)}>×</button>
          </div>

          {erro && <p style={{ color: "red", fontWeight: "bold" }}>Preencha os campos obrigatórios marcados com *</p>}

          <label data-required="*">Título</label>
          <input className="campo" type="text" value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} />

          <label>Valor</label>
          <input className="campo" type="number" value={formulario.valor} onChange={(e) => setFormulario({ ...formulario, valor: e.target.value })} />

          <label>Status</label>
          <input className="campo" type="text" value={formulario.status} onChange={(e) => setFormulario({ ...formulario, status: e.target.value })} />

          <label>Fabricante</label>
          <input className="campo" type="text" value={formulario.fabricante} onChange={(e) => setFormulario({ ...formulario, fabricante: e.target.value })} />

          <label>Solução</label>
          <input className="campo" type="text" value={formulario.solucao} onChange={(e) => setFormulario({ ...formulario, solucao: e.target.value })} />

          <label>Data de Fechamento</label>
          <input className="campo" type="date" value={formulario.data_fechamento} onChange={(e) => setFormulario({ ...formulario, data_fechamento: e.target.value })} />

          <label data-required="*">Empresa</label>
          <select className="campo" value={formulario.empresa_id} onChange={(e) => setFormulario({ ...formulario, empresa_id: e.target.value })}>
            <option value="">Selecione uma empresa</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>

          <label data-required="*">Contato</label>
          <select className="campo" value={formulario.contato_id} onChange={(e) => setFormulario({ ...formulario, contato_id: e.target.value })}>
            <option value="">Selecione um contato</option>
            {contatos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <div className="slide-actions">
            <button className="cancelar" onClick={() => setMostrarEdicao(false)}>Cancelar</button>
            <button className="criar" onClick={handleAtualizar}>Salvar</button>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
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
