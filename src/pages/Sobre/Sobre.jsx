
import { useNavigate } from "react-router-dom";
import {
  HandHeart,
  PackagePlus,
  Search,
  MapPin,
  CircleCheck,
  Building2,
  Heart,
} from "lucide-react";

import "./Sobre.css";

const etapas = [
  {
    icone: PackagePlus,
    titulo: "Publique uma doação",
    descricao:
      "Informe o alimento, a quantidade, a validade e as observações disponíveis.",
  },
  {
    icone: Search,
    titulo: "Encontre e solicite",
    descricao:
      "Consulte as doações e conheça as informações antes de enviar uma solicitação.",
  },
  {
    icone: MapPin,
    titulo: "Combine a retirada",
    descricao:
      "Acompanhe a solicitação e alinhe os detalhes com a outra parte.",
  },
  {
    icone: CircleCheck,
    titulo: "Registre a conclusão",
    descricao:
      "Após a entrega, acompanhe as etapas previstas para sua conta.",
  },
];

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <main className="sobre-page">
      <section className="sobre-intro">
        <p className="sobre-eyebrow">
          <Heart size={15} />
          Conheça nosso projeto
        </p>

        <h1>Sobre o Harvest Hope</h1>

        <p className="sobre-subtitulo">
          Uma plataforma para aproximar quem pode doar de quem precisa
          de alimentos.
        </p>
      </section>

      <section className="sobre-apresentacao">
        <div className="sobre-texto-principal">
          <h2>Compartilhar alimentos é um gesto de cuidado.</h2>

          <p>
            O Harvest Hope é um projeto de plataforma social de doação
            de alimentos. Sua proposta é facilitar o encontro entre
            doadores, pessoas e instituições, tornando as informações
            sobre cada doação mais acessíveis.
          </p>

          <p>
            Uma experiência simples para publicar, encontrar e
            acompanhar doações, com atenção às pessoas envolvidas e
            às condições dos alimentos.
          </p>

          <button
            className="sobre-botao-principal"
            onClick={() => navigate("/doacoes")}
          >
            Explorar doações
          </button>
        </div>

        <div className="sobre-marca">
          <HandHeart size={100} strokeWidth={1.1} />
          <span>Harvest Hope</span>
        </div>
      </section>

      <section className="sobre-mensagem">
        <h2>Alimentos conectam pessoas</h2>

        <p>
          O objetivo do projeto é apoiar o compartilhamento de
          alimentos e a organização de doações na comunidade. A
          plataforma reúne informações para que as partes possam
          combinar a retirada e acompanhar o processo.
        </p>

        <p>
          Esta apresentação descreve a proposta geral do projeto. Não
          representa resultados de impacto, parcerias ou garantias de
          atendimento.
        </p>
      </section>

      <section className="sobre-como-funciona">
        <h2>Como funciona</h2>

        <div className="sobre-etapas">
          {etapas.map((etapa) => {
            const Icone = etapa.icone;

            return (
              <article className="sobre-etapa" key={etapa.titulo}>
                <Icone size={22} />

                <h3>{etapa.titulo}</h3>

                <p>{etapa.descricao}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sobre-final">
        <article>
          <h2>Uma relação de confiança</h2>

          <p>
            Compartilhe informações claras, mantenha os dados da
            doação atualizados e confira as condições dos alimentos.
            Combine a retirada antes de se deslocar.
          </p>
        </article>

        <article>
          <h2>Instituições na comunidade</h2>

          <p>
            Consulte instituições e suas áreas de atuação. Cada
            página apresenta as informações disponibilizadas no
            projeto, sem implicar uma parceria oficial.
          </p>

          <button
            className="sobre-botao-secundario"
            onClick={() => navigate("/instituicoes")}
          >
            <Building2 size={16} />
            Conhecer instituições
          </button>
        </article>
      </section>

      <footer className="sobre-footer">
        <span>© 2026 Harvest Hope · Projeto social</span>
        <span>Doação de alimentos · Comunidade · Cuidado</span>
      </footer>
    </main>
  );
}