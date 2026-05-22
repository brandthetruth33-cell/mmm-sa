export async function fetchLaborTime({ year, make, model, serviceId } = {}) {
  try {
    const response = await fetch(`/api/integrations/prodemand?year=${year}&make=${make}&model=${model}&serviceId=${serviceId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
