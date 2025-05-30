import React, { useEffect, useState } from "react";
import "./modal.css";

function ModalCriacao({ tipo, negocioId, onClose, onCreated }) {
  const [form, setForm] = useState({});
  const [usuarios, setUsuarios] = useState([]);

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  useEffect(() => {
    if (tipo === "tarefa") {
      const token = localStorage.getItem("token");
      fetch("http://localhost:8000/usuarios/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUsuarios(data);
          } else {
            console.error("Resposta inesperada de /usuarios/:", data);
            setUsuarios([]);
          }
        })
        .catch(err => {
          console.error("Erro ao buscar usuários:", err);
          setUsuarios([]);
        });
    }
  }, [tipo]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    let endpoint = "";
    let payload = {};

    if (tipo === "tarefa") {
      endpoint = "tarefas";
      payload = {
        titulo: form.titulo,
        status: form.status,
        prioridade: form.prioridade,
        prazo: form.prazo,
        destinatario: form.destinatario,
        negocio_id: negocioId,
        criador_id: 1,
      };
    } else if (tipo === "observacao") {
      endpoint = "observacoes";
      payload = {
        texto: form.texto,
        negocio_id: negocioId,
        usuario_id: 1,
      };
    } else if (tipo === "reuniao") {
      endpoint = "reunioes";
      payload = {
        data: form.data,
        hora: form.hora,
        pauta: form.pauta,
        participantes: form.participantes,
        negocio_id: negocioId,
        usuario_id: 1,
      };
    }

    console.log("Payload final:", payload);

    await fetch(`http://localhost:8000/${endpoint}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            console.error("Erro ao criar:", err);
            alert(JSON.stringify(err.detail || err, null, 2));
          });
        } else {
          return res.json();
        }
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
            <label>Título<span className="required">*</span></label>
            <input className="campo" placeholder="Título" onChange={e => handleChange("titulo", e.target.value)} required />

            <label>Status<span className="required">*</span></label>
            <select className="campo" onChange={e => handleChange("status", e.target.value)} required>
              <option value="">Selecione um status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>

            <label>Prioridade<span className="required">*</span></label>
            <select className="campo" onChange={e => handleChange("prioridade", e.target.value)} required>
              <option value="">Selecione uma prioridade</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>

            <label>Prazo<span className="required">*</span></label>
            <input className="campo" type="date" onChange={e => handleChange("prazo", e.target.value)} required />

            <label>Destinatário<span className="required">*</span></label>
            <select className="campo" onChange={e => handleChange("destinatario", parseInt(e.target.value))} required>
              <option value="">Selecione o usuário</option>
              {usuarios.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nome}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Observação */}
        {tipo === "observacao" && (
          <>
            <label>Texto da observação<span className="required">*</span></label>
            <textarea className="campo" onChange={e => handleChange("texto", e.target.value)} required />
          </>
        )}

        {/* Reunião */}
        {tipo === "reuniao" && (
          <>
            <label>Data<span className="required">*</span></label>
            <input className="campo" type="date" onChange={e => handleChange("data", e.target.value)} required />

            <label>Hora<span className="required">*</span></label>
            <input className="campo" type="time" onChange={e => handleChange("hora", e.target.value)} required />

            <label>Pauta<span className="required">*</span></label>
            <input className="campo" placeholder="Pauta" onChange={e => handleChange("pauta", e.target.value)} required />

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
