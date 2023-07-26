import type { IBaremetrics } from "@/models/models";
import axios from "axios";
axios.defaults.baseURL = `https://content.launchbrightly.com/lbdemo`;

export default {
  async getBaremetrics(): Promise<IBaremetrics>{
    return await axios.get('/baremetrics.json').then(res=> res.data).catch(e=> console.log(e))
  }
}