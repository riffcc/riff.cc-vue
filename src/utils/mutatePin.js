export default async function mutatePin(url, params) {
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
