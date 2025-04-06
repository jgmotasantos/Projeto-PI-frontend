import "./negocio.css";
import { useState } from "react";

function TelaNegocio() {
  const [negocios] = useState([
    {
      nome: "BANCO DO BRASIL S.A | Solução X",
      etapa: "Pré-Vendas",
      fechamento: "20/10/2025",
      proprietario: "Zezinho (AM)",
      valor: "R$ 100.000,00",
    },
  ]);

  return (
    <div className="negocio-container">
      <div className="negocio-header">
        <h2>Negócios</h2>
        <button className="novo-btn">Criar novo contato</button>
      </div>

      <table className="negocio-tabela">
        <thead>
          <tr>
            <th>Nome do Negócio</th>
            <th>Etapa do negócio</th>
            <th>Data de fechamento</th>
            <th>Proprietário do Negócio</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {negocios.map((n, i) => (
            <tr key={i}>
              <td>{n.nome}</td>
              <td>{n.etapa}</td>
              <td>{n.fechamento}</td>
              <td>{n.proprietario}</td>
              <td>{n.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TelaNegocio;
