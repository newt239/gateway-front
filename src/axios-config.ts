import axios from "axios";
import aspidaClient from "@aspida/axios";
import api from "#/api/$api";

const apiClient = (baseUrl?: string | null) => {
  if (baseUrl) {
    return api(aspidaClient(axios, { baseURL: baseUrl }));
  } else {
    return api(aspidaClient());
  }
};
export default apiClient;
