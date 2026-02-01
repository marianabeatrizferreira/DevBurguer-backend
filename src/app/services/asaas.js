import axios from "axios";

export const asaas = axios.create({
  baseURL: process.env.ASAAS_BASE_URL || "https://api-sandbox.asaas.com/v3",
  headers: {
    access_token: process.env.ASAAS_API_KEY,
    "Content-Type": "application/json",
  },
});