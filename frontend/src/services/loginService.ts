import axios from "axios";

export interface LoginInterface {
  success: number;
  admin: number;
}

export const loginHandler = async (login: string, password: string) => {
  const response = await axios.post<LoginInterface>(
    "http://localhost/logowanie.php",
    { login, password },
  );
  return response.data;
};
