const express = require('express');
const Member = require('../models/member');
const router = express.Router();

router.post('/members/add', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.json({ message: 'Member added successfully', member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/members/update/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member updated successfully', member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/members/delete/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
