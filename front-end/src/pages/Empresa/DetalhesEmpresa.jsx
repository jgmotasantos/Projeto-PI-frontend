import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./empresa.css";

function DetalhesEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [erro, setErro] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    dominio: "",
    cnpj: "",
    area_atuacao: "",
    numero_funcionarios: "",
    fabricante: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/empresas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmpresa(data);
        setFormulario({
          nome: data.nome || "",
          dominio: data.dominio || "",
          cnpj: data.cnpj || "",
          area_atuacao: data.area_atuacao || "",
          numero_funcionarios: data.numero_funcionarios || "",
          fabricante: data.fabricante || false
        });
      });
  }, [id]);

  const handleAtualizar = () => {
    if (!formulario.nome || !formulario.cnpj) {
      setErro(true);
      return;
    }

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/empresas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formulario,
        numero_funcionarios: parseInt(formulario.numero_funcionarios),
      }),
    })
      .then(() => {
        setMostrarEdicao(false);
        window.location.reload();
      });
  };

  const handleExcluir = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:8000/empresas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      navigate("/empresas");
    } else {
      const errorText = await response.text();
      console.error("Erro ao excluir:", errorText);
      alert("Erro ao excluir empresa.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro de conexão ao tentar excluir.");
  }
};


  if (!empresa) return <p>Carregando empresa...</p>;

  return (
    <div className="detalhes-container">
      {/* COLUNA ESQUERDA */}
      <div className="col-esquerda">
        <div className="header-esquerda">
          <h2>{empresa.nome}</h2>
          <div className="icones-empresa">
            <FaEdit title="Editar" onClick={() => setMostrarEdicao(true)} />
            <FaTrash title="Excluir" style={{ marginLeft: "10px" }} onClick={() => setConfirmarExclusao(true)} />
          </div>
        </div>
        <p><strong>Domínio:</strong> {empresa.dominio}</p>
        <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
        <p><strong>Área de Atuação:</strong> {empresa.area_atuacao || "—"}</p>
        <p><strong>Nº de Funcionários:</strong> {empresa.numero_funcionarios || "—"}</p>
        <p><strong>Fabricante:</strong> {empresa.fabricante ? "Sim" : "Não"}</p>
      </div>

      {/* COLUNA CENTRAL */}
      <div className="col-central">
        <h3>Atividades</h3>
        <p>Esta seção exibirá atividades futuras da empresa.</p>
      </div>

      {/* COLUNA DIREITA */}
      
      <div className="col-direita">
        <h4>Contatos ({empresa.contatos?.length || 0})</h4>
        {empresa.contatos?.map((c) => (
          <div key={c.id} className="item-card">
            <strong>{c.nome}</strong>
            <p>Email: {c.email || "—"}</p>
            <p>Telefone: {c.telefone || "—"}</p>
          </div>
        ))}

        <hr />

        <h4>Negócios ({empresa.negocios?.length || 0})</h4>
        {empresa.negocios?.map((n) => (
          <div key={n.id} className="item-card">
            <strong>{n.titulo}</strong>
            <p>Status: {n.status}</p>
            <p>Valor: R$ {n.valor ? parseFloat(n.valor).toFixed(2) : "—"}</p>
          </div>
        ))}
      </div>


      {/* MODAL DE EDIÇÃO */}
      {mostrarEdicao && (
        <div className="slide-form open">
          <div className="slide-header">
            <h3>Editar empresa</h3>
            <button className="fechar" onClick={() => setMostrarEdicao(false)}>×</button>
          </div>

          {erro && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Preencha os campos obrigatórios marcados com *
            </p>
          )}

          <label data-required="*">Nome</label>
          <input className="campo" type="text" value={formulario.nome} onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} />

          <label>Domínio</label>
          <input className="campo" type="text" value={formulario.dominio} onChange={(e) => setFormulario({ ...formulario, dominio: e.target.value })} />

          <label data-required="*">CNPJ</label>
          <input className="campo" type="text" value={formulario.cnpj} onChange={(e) => setFormulario({ ...formulario, cnpj: e.target.value })} />

          <label>Área de Atuação</label>
          <input className="campo" type="text" value={formulario.area_atuacao} onChange={(e) => setFormulario({ ...formulario, area_atuacao: e.target.value })} />

          <label>Nº de Funcionários</label>
          <input className="campo" type="number" value={formulario.numero_funcionarios} onChange={(e) => setFormulario({ ...formulario, numero_funcionarios: e.target.value })} />

          <label>Fabricante</label>
          <select className="campo" value={formulario.fabricante ? "1" : "0"} onChange={(e) => setFormulario({ ...formulario, fabricante: e.target.value === "1" })}>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </select>

          <div className="slide-actions">
            <button className="cancelar" onClick={() => setMostrarEdicao(false)}>Cancelar</button>
            <button className="criar" onClick={handleAtualizar}>Salvar</button>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmarExclusao && (
        <div className="overlay-confirmacao">
          <div className="janela-confirmacao-central">
            <h4>Deseja realmente excluir esta empresa?</h4>
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

export default DetalhesEmpresa;
