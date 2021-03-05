import axios from "axios";
// tracker api est ma connection avec l'api Nager.Date
export default axios.create({
  baseURL: "https://date.nager.at/api",
});
