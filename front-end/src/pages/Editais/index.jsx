import React, { useState, useEffect } from "react";
import "./editais.css";

const dadosFicticios = [
  {
    orgao: "IFRJ - Instituto Federal do Rio de Janeiro",
    numero_pregao: "00001/2025",
    data_abertura: "03/06/2025 10:00",
    modalidade: "Pregão Eletrônico",
    objeto: "Aquisição de notebooks para laboratório de informática",
  },
  {
    orgao: "Ministério da Saúde",
    numero_pregao: "00112/2025",
    data_abertura: "05/06/2025 14:00",
    modalidade: "Pregão Eletrônico",
    objeto: "Compra de equipamentos hospitalares",
  },
  {
    orgao: "Prefeitura de Belo Horizonte",
    numero_pregao: "00321/2025",
    data_abertura: "07/06/2025 09:00",
    modalidade: "Pregão Presencial",
    objeto: "Serviços de manutenção predial",
  },
];

export default function TelaEditais() {
  const [editais, setEditais] = useState([]);

  useEffect(() => {
    // Aqui simulamos como se fosse um fetch da API
    setEditais(dadosFicticios);
  }, []);

  return (
    <div className="container-editais">
      <h1>Editais Disponíveis</h1>
      {editais.length === 0 ? (
        <p>Carregando editais...</p>
      ) : (
        <div className="tabela-editais">
          <table>
            <thead>
              <tr>
                <th>Órgão</th>
                <th>Nº Pregão</th>
                <th>Data Abertura</th>
                <th>Modalidade</th>
                <th>Objeto</th>
              </tr>
            </thead>
            <tbody>
              {editais.map((edital, index) => (
                <tr key={index}>
                  <td>{edital.orgao}</td>
                  <td>{edital.numero_pregao}</td>
                  <td>{edital.data_abertura}</td>
                  <td>{edital.modalidade}</td>
                  <td>{edital.objeto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
