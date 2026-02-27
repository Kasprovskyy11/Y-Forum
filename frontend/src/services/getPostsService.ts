import axios from "axios";
import config from "../config.json";

export interface postInterface {
  id: number;
  name: string;
  username: string;
  text: string;
  photo: string;
  profilePhoto: string;
  date: string; // ← zmień z Date na string
  likes: number;
}

export const getPosts = async (): Promise<postInterface[]> => {
  const response = await axios.get<postInterface[]>(
    `${config.path}/getPosts.php`,
  );
  return response.data;
};
