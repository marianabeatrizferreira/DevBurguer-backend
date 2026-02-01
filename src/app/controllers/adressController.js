
export async function getAddressSuggestions(req, res) {
  try {
    const q = String(req.query.q || "").trim();

    if (q.length < 4) {
      return res.json({ suggestions: [] });
    }

    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ message: "MAPBOX_TOKEN não configurado no .env" });
    }

    
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
      `?country=BR&language=pt&limit=6&types=address,place&access_token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(502)
        .json({ message: "Falha ao consultar o Mapbox" });
    }

    const data = await response.json();

    const suggestions = (data.features || []).map((feature) => ({
      id: feature.id,
      label: feature.place_name,
      center: feature.center,    
    }));

    return res.json({ suggestions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno ao buscar endereços" });
  }
}
