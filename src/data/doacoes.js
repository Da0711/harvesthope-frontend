const CHAVE_DOACOES = "harvesthope_doacoes";

export const doacoesIniciais = [
  {
    id: 1,
    nomeAlimento: "Cestas básicas",
    quantidade: 15,
    unidade: "unidades",
    dataValidade: "2026-12-30",
    descricao:
      "Cestas contendo arroz, feijão, macarrão, óleo e outros alimentos não perecíveis.",
    foto: "",
    localRetirada: "Centro, Osasco - SP",
    status: "Disponível",
    doador: "Mercado Solidário",
  },
  {
    id: 2,
    nomeAlimento: "Arroz",
    quantidade: 25,
    unidade: "kg",
    dataValidade: "2027-04-15",
    descricao:
      "Pacotes de arroz para distribuição a famílias em situação de vulnerabilidade.",
    foto: "",
    localRetirada: "Vila Yara, Osasco - SP",
    status: "Disponível",
    doador: "Doador demonstrativo",
  },
  {
    id: 3,
    nomeAlimento: "Feijão",
    quantidade: 12,
    unidade: "kg",
    dataValidade: "2027-02-20",
    descricao:
      "Feijão para complementar as refeições de famílias atendidas por instituições sociais.",
    foto: "",
    localRetirada: "Presidente Altino, Osasco - SP",
    status: "Disponível",
    doador: "Projeto Mesa Solidária",
  },
  {
    id: 4,
    nomeAlimento: "Frutas variadas",
    quantidade: 8,
    unidade: "kg",
    dataValidade: "2026-10-25",
    descricao:
      "Frutas variadas em boas condições para consumo. Recomenda-se retirada rápida.",
    foto: "",
    localRetirada: "Quitaúna, Osasco - SP",
    status: "Disponível",
    doador: "Feira Comunitária",
  },
  {
    id: 5,
    nomeAlimento: "Leite",
    quantidade: 20,
    unidade: "L",
    dataValidade: "2026-11-30",
    descricao:
      "Leite em embalagem fechada, armazenado adequadamente.",
    foto: "",
    localRetirada: "Jaguaribe, Osasco - SP",
    status: "Disponível",
    doador: "Doador demonstrativo",
  },
  {
    id: 6,
    nomeAlimento: "Macarrão",
    quantidade: 30,
    unidade: "pacotes",
    dataValidade: "2027-06-10",
    descricao:
      "Pacotes de macarrão para ajudar na montagem de cestas de alimentos.",
    foto: "",
    localRetirada: "Zona Oeste, São Paulo - SP",
    status: "Disponível",
    doador: "Rede Alimentar Solidária",
  },
];

export function carregarDoacoes() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_DOACOES);

    if (dadosSalvos !== null) {
      const dados = JSON.parse(dadosSalvos);

      if (Array.isArray(dados)) {
        return dados;
      }
    }

    localStorage.setItem(
      CHAVE_DOACOES,
      JSON.stringify(doacoesIniciais)
    );

    return doacoesIniciais;
  } catch (erro) {
    console.error("Erro ao carregar doações:", erro);
    return doacoesIniciais;
  }
}

export function salvarDoacoes(doacoes) {
  try {
    localStorage.setItem(
      CHAVE_DOACOES,
      JSON.stringify(doacoes)
    );

    return true;
  } catch (erro) {
    console.error("Erro ao salvar doações:", erro);
    return false;
  }
}

export function buscarDoacaoPorId(id) {
  const doacoes = carregarDoacoes();

  return (
    doacoes.find(
      (doacao) => String(doacao.id) === String(id)
    ) || null
  );
}
