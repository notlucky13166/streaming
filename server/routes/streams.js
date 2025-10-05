const express = require('express');
const axios = require('axios');
const Stream = require('../models/Stream');
const auth = require('../middleware/auth');
const router = express.Router();

const STREAMI_API_KEY = process.env.STREAMI_API_KEY;
const STREAMI_BASE_URL = 'https://api.streami.su/v1';

// Get all active streams
router.get('/', async (req, res) => {
  try {
    const streams = await Stream.find({ status: 'active' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// Get stream by ID
router.get('/:id', async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json(stream);
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(500).json({ error: 'Failed to fetch stream' });
  }
});

// Create new stream (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Create stream on Streami platform
    const streamiResponse = await axios.post(
      `${STREAMI_BASE_URL}/streams`,
      {
        title,
        description,
        type: 'live'
      },
      {
        headers: {
          'Authorization': `Bearer ${STREAMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const streamiData = streamiResponse.data;

    // Save stream to MongoDB
    const stream = new Stream({
      title,
      description,
      streamiId: streamiData.id,
      hlsUrl: streamiData.hls_url,
      status: 'active',
      createdBy: req.user.id,
      thumbnail: streamiData.thumbnail || ''
    });

    await stream.save();

    res.status(201).json(stream);
  } catch (error) {
    console.error('Error creating stream:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// Update stream status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status } = req.body;
    
    if (!['active', 'inactive', 'ended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json(stream);
  } catch (error) {
    console.error('Error updating stream status:', error);
    res.status(500).json({ error: 'Failed to update stream status' });
  }
});

// Delete stream (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    // Delete from Streami platform
    await axios.delete(`${STREAMI_BASE_URL}/streams/${stream.streamiId}`, {
      headers: {
        'Authorization': `Bearer ${STREAMI_API_KEY}`
      }
    });

    // Delete from MongoDB
    await Stream.findByIdAndDelete(req.params.id);

    res.json({ message: 'Stream deleted successfully' });
  } catch (error) {
    console.error('Error deleting stream:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete stream' });
  }
});

// Update viewer count
router.post('/:id/viewers', async (req, res) => {
  try {
    const { action } = req.body; // 'increment' or 'decrement'

    const update = action === 'increment' 
      ? { $inc: { viewers: 1 } }
      : { $inc: { viewers: -1 } };

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json({ viewers: stream.viewers });
  } catch (error) {
    console.error('Error updating viewer count:', error);
    res.status(500).json({ error: 'Failed to update viewer count' });
  }
});

module.exports = router;