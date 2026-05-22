export async function fetchPartPricing({ partNumber } = {}) {
  try {
    const response = await fetch(`/api/integrations/oreilly?partNumber=${partNumber}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
