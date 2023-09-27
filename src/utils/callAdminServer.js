import axios from 'axios';

export default async function callAdminServer(url, params) {
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error on callAdminServer:', error);
  }
}

