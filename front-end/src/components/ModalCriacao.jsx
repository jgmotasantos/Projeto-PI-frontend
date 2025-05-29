import React, { useState } from "react";
import "./modal.css";

function ModalCriacao({ tipo, negocioId, onClose, onCreated }) {
  const [form, setForm] = useState({});

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    let endpoint = "";
    let payload = {};

    if (tipo === "tarefa") {
      endpoint = "tarefas";
      payload = { ...form, negocio_id: negocioId, criador_id: 1 };
    } else if (tipo === "observacao") {
      endpoint = "observacoes";
      payload = { ...form, negocio_id: negocioId, usuario_id: 1 };
    } else if (tipo === "reuniao") {
      endpoint = "reunioes";
      payload = { ...form, negocio_id: negocioId, usuario_id: 1 };
    }

    await fetch(`http://localhost:8000/${endpoint}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    onCreated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Criar {tipo}</h3>

        {tipo === "tarefa" && (
          <>
            <label>Título</label>
            <input className="campo" placeholder="Título" onChange={e => handleChange("titulo", e.target.value)} />

            <label>Status</label>
            <select className="campo" onChange={e => handleChange("status", e.target.value)}>
              <option value="">Selecione um status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>

            <label>Prioridade</label>
            <select className="campo" onChange={e => handleChange("prioridade", e.target.value)}>
              <option value="">Selecione a prioridade</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>

            <label>Prazo</label>
            <input className="campo" type="date" onChange={e => handleChange("prazo", e.target.value)} />

            <label>Destinatário (ID)</label>
            <input className="campo" placeholder="ID do destinatário" onChange={e => handleChange("destinatario", parseInt(e.target.value))} />
          </>
        )}

        {tipo === "observacao" && (
          <>
            <label>Texto da observação</label>
            <textarea className="campo" onChange={e => handleChange("texto", e.target.value)} />
          </>
        )}

        {tipo === "reuniao" && (
          <>
            <label>Data</label>
            <input className="campo" type="date" onChange={e => handleChange("data", e.target.value)} />

            <label>Hora</label>
            <input className="campo" type="time" onChange={e => handleChange("hora", e.target.value)} />

            <label>Pauta</label>
            <input className="campo" placeholder="Pauta" onChange={e => handleChange("pauta", e.target.value)} />

            <label>Participantes</label>
            <input className="campo" placeholder="Participantes" onChange={e => handleChange("participantes", e.target.value)} />
          </>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCriacao;
