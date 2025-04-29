const express = require('express');
const Debtor = require('./debtors'); // Import the Debtor model

const router = express.Router();

// Get all debtors
router.get('/', async (req, res) => {
    try {
        const debtors = await Debtor.findAll();
        res.json(debtors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch debtors' });
    }
});

// Get a single debtor by ID
router.get('/:id', async (req, res) => {
    try {
        const debtor = await Debtor.findByPk(req.params.id);
        if (!debtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }
        res.json(debtor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch debtor' });
    }
});

// Create a new debtor
router.post('/', async (req, res) => {
    try {
        const { name, phone, debtAmount } = req.body;
        const newDebtor = await Debtor.create({ name, phone, debtAmount });
        res.status(201).json(newDebtor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create debtor' });
    }
});

// Update a debtor by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, debtAmount } = req.body;
        const debtor = await Debtor.findByPk(req.params.id);
        if (!debtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }
        await debtor.update({ name, phone, debtAmount });
        res.json(debtor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update debtor' });
    }
});

// Delete a debtor by ID
router.delete('/:id', async (req, res) => {
    try {
        const debtor = await Debtor.findByPk(req.params.id);
        if (!debtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }
        await debtor.destroy();
        res.json({ message: 'Debtor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete debtor' });
    }
});

module.exports = router;
