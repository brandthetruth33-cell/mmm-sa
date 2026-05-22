export async function fetchPartPricing({ partNumber } = {}) {
  try {
    const url = new URL('https://api.oreillyauto.example.com/pricing');
    if (partNumber !== undefined) url.searchParams.set('partNumber', partNumber);
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const data = await response.json();
    return { price: data.price, partNumber: data.partNumber };
  } catch {
    return null;
  }
}
