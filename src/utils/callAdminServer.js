export default async function callAdminServer(url, params) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return await response.json();

};
