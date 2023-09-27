import axios from 'axios';
const API_URL = import.meta.env.VITE_INFURA_API_URL
const API_KEY = import.meta.env.VITE_INFURA_API_KEY
const API_KEY_SECRET = import.meta.env.VITE_INFURA_API_KEY_SECRET


export default async function getCIDContent(cid) {
  if (!API_KEY || !API_KEY_SECRET) throw new Error("INFURA_API_KEY or INFURA_API_KEY_SECRET env vars undefined")
  const credentials = `${API_KEY}:${API_KEY_SECRET}`;
  
  const response = await axios.post(
    `https://${API_URL}/api/v0/dag/get?arg=${cid}`,
    undefined,
    {
      headers: {
        "Authorization": `Basic ${Buffer.from(credentials).toString('base64')}`
      }
    });
  const data = response.data["Data"]
  console.log('data', data)
  if (data && data["/"].bytes === "CAE") {
    return response.data["Links"].map(link => ({ cid: link["Hash"]["/"], name: link["Name"] }))
  } else {
    throw new Error("Format not supported")
  }
}
