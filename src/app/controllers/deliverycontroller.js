
function calcDeliveryFeeFromKm(km) {
  const base = 600;   
  const perKm = 200; 

  let fee = base + Math.round(km * perKm);

  const min = 800;   
  const max = 2500;  

  fee = Math.max(fee, min);
  fee = Math.min(fee, max);

  return fee;
}

export async function getDeliveryTax(req, res) {
  try {
   
    const STORE = {
      lng: -44.274783854484554,
      lat: -19.919007055866086,
    };

    console.log("DELIVERY CONTROLLER OK");
    console.log("STORE:", STORE);

    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return res.status(500).json({
        message: "MAPBOX_TOKEN não configurado no .env",
      });
    }

    const { address } = req.body || {};

    if (!address || String(address).trim().length < 8) {
      return res.status(400).json({
        message: "Endereço inválido ou incompleto.",
      });
    }

    const finalAddress = `${String(address).trim()}, Brasil`;
    console.log("ADDRESS USED:", finalAddress);

 
    const geoUrl =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        finalAddress
      )}.json` +
      `?limit=1&country=BR&language=pt&types=address` +
      `&proximity=${STORE.lng},${STORE.lat}` +
      `&access_token=${token}`;

    console.log("GEOCODING URL:", geoUrl);

    const geoResp = await fetch(geoUrl);
    const geo = await geoResp.json();

    if (!geoResp.ok) {
      console.log("GEOCODING HTTP FAIL:", geoResp.status, geo);
      return res.status(502).json({
        message: "Falha no geocoding do Mapbox",
        geo,
      });
    }

    if (!geo.features || geo.features.length === 0) {
      return res.status(404).json({
        message: "Endereço não encontrado.",
      });
    }

    const [destLng, destLat] = geo.features[0].center;
    console.log("DEST:", { destLng, destLat });


    const dirUrl =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${STORE.lng},${STORE.lat};${destLng},${destLat}` +
      `?overview=false&alternatives=false&geometries=geojson` +
      `&access_token=${token}`;

    console.log("DIRECTIONS URL:", dirUrl);

    const dirResp = await fetch(dirUrl);
    const dir = await dirResp.json();

    if (!dirResp.ok) {
      console.log("DIRECTIONS HTTP FAIL:", dirResp.status, dir);
      return res.status(502).json({
        message: "Falha ao consultar rota do Mapbox",
        dir,
      });
    }

    if (!dir.routes || dir.routes.length === 0) {
      console.log("NO ROUTE:", dir);
      return res.status(400).json({
        message: "Não foi possível calcular a rota",
      });
    }

    const route = dir.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    const km = distanceMeters / 1000;


    const maxKm = 15;
    if (km > maxKm) {
      return res.status(400).json({
        message: `Fora da área de entrega (limite ${maxKm} km).`,
        km: Number(km.toFixed(2)),
      });
    }

    const deliveryTax = calcDeliveryFeeFromKm(km);

    return res.json({
      km: Number(km.toFixed(2)),
      etaMinutes: Math.round(durationSeconds / 60),
      deliveryTax,
    });
  } catch (err) {
    console.log("🔥 CATCH getDeliveryTax:", err);
    console.log("🔥 STACK:", err?.stack);

    return res.status(500).json({
      message: "Erro ao calcular taxa de entrega.",
      error: err?.message,
    });
  }
}
