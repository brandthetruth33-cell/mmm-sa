export async function apiClient(endpoint, options = {}) {
  const response = await fetch(endpoint, options);
  return response;
}
