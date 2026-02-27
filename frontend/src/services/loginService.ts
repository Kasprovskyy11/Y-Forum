import axios from "axios";
import config from "../config.json";

export interface LoginInterface {
  success: number;
  admin: number;
}

export const loginHandler = async (login: string, password: string) => {
  const response = await axios.post<LoginInterface>(
    `${config.path}/logowanie.php`,
    { login, password },
  );
  return response.data;
};
