import { asaas } from "../services/asaas.js";

function toISODatePlusDays(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; 
}

function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function firstAsaasErrorMessage(asaasData) {

  const desc = asaasData?.errors?.[0]?.description;
  const code = asaasData?.errors?.[0]?.code;
  if (desc && code) return `${desc} (${code})`;
  if (desc) return desc;
  return null;
}

export async function createPix(req, res) {
  try {
    const { total, customer, description } = req.body;

    const totalNumber = Number(total);
    if (!Number.isFinite(totalNumber) || totalNumber <= 0) {
      return res.status(400).json({ message: "Total inválido." });
    }

    const cpfCnpj = onlyDigits(customer?.cpfCnpj || "11144477735");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      return res.status(400).json({ message: "CPF/CNPJ inválido." });
    }


    const customerPayload = {
      name: customer?.name || "Cliente Teste",
      email: customer?.email || "cliente.teste@email.com",
      cpfCnpj,
    };

    const { data: customerCreated } = await asaas.post(
      "/customers",
      customerPayload
    );

    const dueDate = toISODatePlusDays(1);


    const value = Math.min(totalNumber, 5);


    const { data: payment } = await asaas.post("/payments", {
      customer: customerCreated.id,
      billingType: "PIX",
      value,
      dueDate,
      description: description || "Pedido (Pix)",
    });

    const { data: pixQr } = await asaas.get(
      `/payments/${payment.id}/pixQrCode`
    );

    return res.status(200).json({
      paymentId: payment.id,
      status: payment.status,
      value, 
      dueDate,
      encodedImage: pixQr.encodedImage, 
      payload: pixQr.payload, 
      expirationDate: pixQr.expirationDate,
    });
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    console.log("createPix error status:", status);
    console.log("createPix error data:", data || err);

 
    const asaasMsg = firstAsaasErrorMessage(data);

    return res.status(status && status >= 400 && status < 600 ? status : 500).json({
      message: asaasMsg || "Erro ao gerar Pix.",
      detail: data || err?.message,
    });
  }
}
