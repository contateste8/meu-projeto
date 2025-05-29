export default async function handler(req, res) {
    if (req.method === 'POST') {
        const webhookUrl = "https://discord.com/api/webhooks/1377330816664731709/bl_oh9S8js6rhNgBNMmqSplQc7f__4dde322QGU-qSnq-VzQVvjQ_JwRjwDDQX2SDa6I";

        const payload = {
            content: "entrou no site ou clicou no botÃ£o!"
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ error: 'Erro ao enviar webhook' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Falha no servidor' });
        }
    } else {
        res.status(405).json({ error: 'MÃ©todo nÃ£o permitido' });
    }
}
