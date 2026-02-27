import axios from "axios";
import type { postInterface } from "./getPostsService";
import config from "../config.json";

export interface UserData {
  name: string;
  username: string;
  profilePicture: string;
  birth_date: string;
  posts: postInterface[];
}

export const getUserData = async (user: string): Promise<UserData> => {
  const response = await axios.post<UserData>(`${config.path}/user_data.php`, {
    name: user,
  });
  return response.data;
};
