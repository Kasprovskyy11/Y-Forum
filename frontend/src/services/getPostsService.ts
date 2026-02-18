import axios from "axios";

export interface postInterface {
  id: number;
  name: string;
  username: string;
  text: string;
  photo: string;
  date: string; // ← zmień z Date na string
  likes: number;
}

export const getPosts = async (): Promise<postInterface[]> => {
  const response = await axios.get<postInterface[]>(
    "http://localhost/getPosts.php",
  );
  return response.data;
};
