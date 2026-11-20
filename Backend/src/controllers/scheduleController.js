const Schedule = require('../models/Schedule');

let tempSchedules = [
  { id: 1, wasteType: 'Wet & Dry Waste', collectionDate: 'Monday - Saturday', collectionTime: '07:30 AM - 09:30 AM', instructions: 'Keep wet and dry waste in separate bins.' },
  { id: 2, wasteType: 'E-Waste & Recyclables', collectionDate: 'Sunday', collectionTime: '10:00 AM - 12:00 PM', instructions: 'Hand over batteries, plastics, and electronics separately.' }
];

exports.getSchedules = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) return res.json({ status: 'success', count: tempSchedules.length, data: tempSchedules });
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    res.json({ status: 'success', count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { wasteType, collectionDate, collectionTime, instructions } = req.body;
    if (!wasteType || !collectionDate || !collectionTime) return res.status(400).json({ status: 'error', message: 'wasteType, collectionDate, and collectionTime are required' });
    if (!process.env.MONGO_URI) {
      const newSchedule = { id: tempSchedules.length + 1, wasteType, collectionDate, collectionTime, instructions: instructions || '' };
      tempSchedules.push(newSchedule);
      return res.status(201).json({ status: 'success', data: newSchedule });
    }
    const schedule = await Schedule.create({ wasteType, collectionDate, collectionTime, instructions });
    res.status(201).json({ status: 'success', data: schedule });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      const item = tempSchedules.find((s) => s.id === parseInt(req.params.id));
      if (!item) return res.status(404).json({ status: 'error', message: 'Schedule not found' });
      Object.assign(item, req.body);
      return res.json({ status: 'success', data: item });
    }
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ status: 'error', message: 'Schedule not found' });
    res.json({ status: 'success', data: schedule });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      const index = tempSchedules.findIndex((s) => s.id === parseInt(req.params.id));
      if (index === -1) return res.status(404).json({ status: 'error', message: 'Schedule not found' });
      tempSchedules.splice(index, 1);
      return res.json({ status: 'success', message: 'Schedule deleted' });
    }
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ status: 'error', message: 'Schedule not found' });
    res.json({ status: 'success', message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
