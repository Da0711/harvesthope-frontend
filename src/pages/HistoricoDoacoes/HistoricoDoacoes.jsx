import { Link } from "react-router-dom";
import { ArrowLeft, History, PackageCheck } from "lucide-react";
import "./HistoricoDoacoes.css";

export default function HistoricoDoacoes() {
  let historico = [];

  try {
    const dados = JSON.parse(
      localStorage.getItem("harvesthope_historico_doacoes") || "[]"
    );

    if (Array.isArray(dados)) {
      historico = dados;
    }
  } catch {
    historico = [];
  }

  return (
    <main className="historico-page">
      <header className="historico-header">
        <Link to="/home" className="historico-voltar">
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <div className="historico-titulo">
          <div className="historico-icone">
            <History size={26} />
          </div>

          <div>
            <h1>Histórico de doações</h1>
            <p>Acompanhe as doações realizadas e seus registros.</p>
          </div>
        </div>
      </header>

      <section className="historico-conteudo">
        <div className="historico-resumo">
          <div>
            <span>Total de registros</span>
            <strong>{historico.length}</strong>
          </div>
        </div>

        <div className="historico-tabela-container">
          <h2>Suas doações</h2>

          {historico.length === 0 ? (
            <div className="historico-vazio">
              <PackageCheck size={42} />
              <h3>Nenhum registro encontrado</h3>
              <p>
                Quando houver doações registradas no histórico,
                elas aparecerão nesta página.
              </p>
              <Link to="/doacoes">Ver doações</Link>
            </div>
          ) : (
            <div className="historico-tabela-scroll">
              <table className="historico-tabela">
                <thead>
                  <tr>
                    <th>Doação</th>
                    <th>Instituição</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {historico.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        {item.nomeAlimento ||
                          item.nome ||
                          item.doacaoNome ||
                          "Doação"}
                      </td>
                      <td>{item.instituicao || "Não informada"}</td>
                      <td>{item.data || item.criadaEm || "—"}</td>
                      <td>
                        <span className="historico-status">
                          {item.status || "Registrada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}