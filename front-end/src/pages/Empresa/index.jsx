import { useState } from "react";
import "./empresa.css";

function TelaEmpresa() {
  const [empresas] = useState([
    { nome: "STF - Supremo tribunal", cnpj: "00.531.640/0001-28", atividade: "26-03-2025 17:05 GMT", telefone: "(61) 3217-3416" },
    { nome: "BANCO DO BRASIL S.A", cnpj: "00.000.000/0001-91", atividade: "26-03-2025 13:27 GMT", telefone: "0800 729 0722" },
    { nome: "Magazine Luiza", cnpj: "47.960.950/0001-21", atividade: "25-03-2025 10:27 GMT", telefone: "0800 310 0002" },
  ]);

  return (
    <div className="empresa-container">
      <div className="empresa-header">
        <h2>Empresas</h2>
        <button className="nova-btn">Criar nova empresa</button>
      </div>

      <table className="empresa-tabela">
        <thead>
          <tr>
            <th>Nome da Empresa</th>
            <th>CNPJ da Empresa</th>
            <th>Última Atividade</th>
            <th>Número de Telefone</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e, i) => (
            <tr key={i}>
              <td>{e.nome}</td>
              <td>{e.cnpj}</td>
              <td>{e.atividade}</td>
              <td>{e.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TelaEmpresa;
