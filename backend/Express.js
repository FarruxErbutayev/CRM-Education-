const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/payment/generate_qr', async (req, res) => {
    try {
        const { amount, method } = req.body;
        if (!amount || !method) {
            return res.status(400).json({ error: "To'lov summasi va usuli talab qilinadi." });
        }

        const paymentUrl = `https://payment-provider.com/pay?amount=${amount}&method=${method}`;
        const qrCodeUrl = await QRCode.toDataURL(paymentUrl);

        res.json({ qrCodeUrl });
    } catch (error) {
        console.error("QR kod yaratishda xatolik:", error);
        res.status(500).json({ error: "Ichki server xatosi" });
    }
});

const PORT = 4100;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlayapti...`);
});
