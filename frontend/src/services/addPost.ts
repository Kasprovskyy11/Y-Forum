import axios from "axios";
import config from "../config.json";

export interface AddPostInterface {
  name: string | null;
  photoFile?: File | null;
  temat: string;
  text: string;
}

export const addPost = async ({
  name,
  photoFile,
  temat,
  text,
}: AddPostInterface) => {
  const url = `http://${config.path}/addPosts.php`;

  const form = new FormData();
  form.append("name", name || "");
  form.append("temat", temat);
  form.append("text", text);
  if (photoFile) form.append("file", photoFile, photoFile.name);

  const res = await axios.post(url, form);
  console.log(res.data);
};
