import { getAxios } from "./axios.ts";

export async function deleteAxios(url: string, token?: string) {
  const axios = getAxios();
  return axios.delete(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
