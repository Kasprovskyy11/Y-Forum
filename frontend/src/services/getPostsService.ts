import axios from "axios";

export interface postInterface {
  name: string;
  username: string;
  text: string;
  photo: string;
  likes: number;
}

export const getPosts = async (): Promise<postInterface[]> => {
  const response = await axios.get<postInterface[]>(
    "http://localhost/getPosts.php",
  );
  return response.data;
};
