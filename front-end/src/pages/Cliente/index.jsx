import "./cliente.css";
import { useState } from "react";

function TelaCliente() {
  const [clientes] = useState([
    {
      nome: "Joazinho Barreto",
      email: "joazinhobarreto@banco.com",
      responsavel: "Zezinho (AM)",
      telefone: "+55 (61) 9999-9999",
      associado: "BANCO DO BRASIL S.A",
    },
  ]);

  return (
    <div className="cliente-container">
      <div className="cliente-header">
        <h2>Contatos</h2>
        <button className="novo-btn">Criar novo contato</button>
      </div>

      <table className="cliente-tabela">
        <thead>
          <tr>
            <th>Nome do Contato</th>
            <th>Email de contato</th>
            <th>Responsável pelo Contato</th>
            <th>Número de Telefone</th>
            <th>Associado</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c, i) => (
            <tr key={i}>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.responsavel}</td>
              <td>{c.telefone}</td>
              <td>{c.associado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TelaCliente;
