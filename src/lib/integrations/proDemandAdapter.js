export async function fetchLaborTime({ year, make, model, serviceId } = {}) {
  try {
    const url = new URL('https://api.prodemand.example.com/labor');
    if (year !== undefined) url.searchParams.set('year', year);
    if (make !== undefined) url.searchParams.set('make', make);
    if (model !== undefined) url.searchParams.set('model', model);
    if (serviceId !== undefined) url.searchParams.set('serviceId', serviceId);
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const data = await response.json();
    return { hours: data.hours, operation: data.operation };
  } catch {
    return null;
  }
}
