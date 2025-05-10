import axios from "axios";
import { ALPHA_API_KEY } from "../env";

export const apiInstance = axios.create({
  baseURL: "https://www.alphavantage.co/query",
});

apiInstance.interceptors.request.use(function onFullfil(value) {
  value.params = { ...value.params, apikey: ALPHA_API_KEY };
  return value;
});
