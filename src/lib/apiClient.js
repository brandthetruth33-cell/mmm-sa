export async function apiClient(endpoint, options = {}) {
  const { body, ...rest } = options;
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json' },
    ...rest,
  };
  if (body !== undefined) {
    fetchOptions.body = typeof body === 'object' ? JSON.stringify(body) : body;
  }
  const response = await fetch(endpoint, fetchOptions);
  return response;
}

