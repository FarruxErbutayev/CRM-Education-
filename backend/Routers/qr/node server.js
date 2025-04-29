// Backend: Node.js + Express
const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB ulanishi
mongoose.connect('mongodb://localhost:27017/qrcode_payments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const PaymentSchema = new mongoose.Schema({
    user: String,
    amount: Number,
    status: { type: String, default: 'pending' }
});

const Payment = mongoose.model('Payment', PaymentSchema);

// QR kod yaratish
app.post('/generate-qr', async (req, res) => {
    const { user, amount } = req.body;
    const payment = new Payment({ user, amount });
    await payment.save();
    
    const qrData = `http://localhost:4100/pay/${payment.id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode, paymentId: payment.id });
});

// To‘lovni tekshirish
app.get('/pay/:id', async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).send('To‘lov topilmadi');
    res.json(payment);
});

app.listen(5000, () => console.log('Server 4100-portda ishlamoqda'));
