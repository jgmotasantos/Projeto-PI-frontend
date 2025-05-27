import { useEffect, useState } from "react";
import "./tarefa.css";

function TelaTarefa() {
  const [editais, setEditais] = useState([]);
  const [editaisFiltrados, setEditaisFiltrados] = useState([]);
  const [buscaTexto, setBuscaTexto] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const carregarEditais = () => {
    setCarregando(true);
    setErro(null);

    fetch("http://localhost:8000/api/tarefas") // <- endpoint correto para scraping
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar editais");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEditais(data);
          setEditaisFiltrados(data);
        } else {
          setEditais([]);
          setEditaisFiltrados([]);
          setErro("Dados inválidos recebidos da API.");
        }
        setCarregando(false);
      })
      .catch((err) => {
        setErro(err.message);
        setCarregando(false);
      });
  };

  useEffect(() => {
    carregarEditais();
  }, []);

  const filtrarEditais = (texto) => {
    setBuscaTexto(texto);
    const resultado = editais.filter((e) =>
      e.titulo?.toLowerCase().includes(texto.toLowerCase()) ||
      e.descricao?.toLowerCase().includes(texto.toLowerCase())
    );
    setEditaisFiltrados(resultado);
  };

  return (
    <div className="tarefa-container">
      <h2>Editais (via Webscraping)</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          className="campo"
          placeholder="Buscar por título ou descrição"
          value={buscaTexto}
          onChange={(e) => filtrarEditais(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="nova-btn" onClick={carregarEditais}>Atualizar</button>
      </div>

      {carregando && <p>Carregando editais...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {Array.isArray(editaisFiltrados) && editaisFiltrados.length === 0 && !carregando ? (
        <p>Nenhum edital encontrado.</p>
      ) : (
        <div className="tarefa-lista">
          {editaisFiltrados.map((edital, i) => (
            <div key={i} className="tarefa-card">
              <h4>{edital.titulo}</h4>
              <p>{edital.descricao}</p>
              {edital.link && (
                <a href={edital.link} target="_blank" rel="noreferrer">
                  Acessar edital
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TelaTarefa;
