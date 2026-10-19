
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const dadosSalvos = localStorage.getItem("usuario");

      if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);
        const token = usuario?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error(
        "Erro ao recuperar os dados de autenticação:",
        error
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
