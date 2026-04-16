import axios, { type AxiosInstance } from "axios";


const createAxiosInstance = (): AxiosInstance => {
  // const config = useRuntimeConfig();
  // const baseUrl = "http://localhost:8080/api";

  return axios.create({
    // baseURL: baseUrl
  });
};

export default createAxiosInstance;
