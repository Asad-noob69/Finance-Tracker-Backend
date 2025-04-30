const Target = require('../models/Target');

// Get current month/year targets by default
exports.getAllTargets = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const targets = await Target.findAll({ 
      where: { 
        userId: req.user.id,
        month,
        year
      } 
    });
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
};

exports.createTarget = async (req, res) => {
  try {
    const { amount, category, createdAt } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Target amount is required' });
    }

    const currentDate = new Date();
    const target = await Target.create({
      amount,
      category: category || 'expense', // Default to expense if not provided
      createdAt: createdAt || currentDate, // Use provided createdAt or current date
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      userId: req.user.id,
    });

    res.status(201).json(target);
  } catch (error) {
    console.error('Error creating target:', error);
    res.status(500).json({ error: 'Failed to create target' });
  }
};

exports.updateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, createdAt } = req.body;

    const target = await Target.findOne({ where: { id, userId: req.user.id } });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    const updates = {};
    
    if (amount !== undefined) updates.amount = amount;
    if (category !== undefined) updates.category = category;
    if (createdAt !== undefined) updates.createdAt = createdAt;

    await target.update(updates);
    res.status(200).json(target);
  } catch (error) {
    console.error('Error updating target:', error);
    res.status(500).json({ error: 'Failed to update target' });
  }
};

exports.deleteTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Target.findOne({ where: { id, userId: req.user.id } });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    await target.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete target' });
  }
};