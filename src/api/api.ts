import type { IBaremetrics } from "@/models/models";
import axios from "axios";
axios.defaults.baseURL = `${import.meta.env.VITE_APP_API_URL}`;

export default {
  async getBaremetrics(): Promise<IBaremetrics>{
    return await axios.get('/baremetrics.json').then(res=> res.data)
  }
}