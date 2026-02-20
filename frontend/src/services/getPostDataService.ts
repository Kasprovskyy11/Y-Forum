// services/getPostDataService.ts
import axios from "axios";

export interface PostData {
  id: number;
  name: string;
  username: string;
  text: string;
  photo: string;
  date: string; // ← zmień z Date na string
  likes: number;
}

export const getPostData = async (postId: string): Promise<PostData> => {
  const id = parseInt(postId, 10);
  const response = await axios.post<PostData>(
    "http://localhost/dane_posta.php",
    { id: id }, // wysyłamy ID w body
  );
  return response.data;
};
