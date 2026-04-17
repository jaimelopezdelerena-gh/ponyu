const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar multer usando memoria para guardar archivos en base64 (Solución para disco efímero de Render)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const fileToBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Conexión a MongoDB (Atlas)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://jaimelopezdelerena_db_user:uVnrzJ0O7fNiZ1Iw@cluster0.xqp1vft.mongodb.net/ponyu?appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas exitosamente 😎'))
  .catch(err => console.error('Error conectando a MongoDB', err));

// Modelos (Mongoose) restaurados y actualizados
const memorySchema = new mongoose.Schema({
  title: String,
  description: String,
  coverPhoto: String, // Base64 string
  photos: [String],   // Base64 strings array
  startDate: Date,
  endDate: Date,
  creator: String,
  category: String, // Retrocompatibilidad
  categories: [String], // Array moderno
  createdAt: { type: Date, default: Date.now }
});
const Memory = mongoose.model('Memory', memorySchema);

const giftSchema = new mongoose.Schema({
  title: String,
  description: String,
  coverPhoto: String,
  photos: [String],
  creator: String,
  category: String, 
  isClue: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Gift = mongoose.model('Gift', giftSchema);

const planSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  estimatedBudget: Number,
  creator: String,
  coverPhoto: String,
  photos: [String],
  createdAt: { type: Date, default: Date.now }
});
const Plan = mongoose.model('Plan', planSchema);

// Rutas - Memories
app.post('/api/memories', upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'photos', maxCount: 10 }]), async (req, res) => {
  try {
    const memoryData = { ...req.body };
    if (req.body.categories) {
      try { memoryData.categories = JSON.parse(req.body.categories); } catch (e) { memoryData.categories = []; }
    }
    if (req.files && req.files['coverPhoto']) {
      memoryData.coverPhoto = fileToBase64(req.files['coverPhoto'][0]);
    }
    if (req.files && req.files['photos']) {
      memoryData.photos = req.files['photos'].map(fileToBase64);
    }
    const memory = new Memory(memoryData);
    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/memories/:id', upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'photos', maxCount: 10 }]), async (req, res) => {
  try {
    const memoryData = { ...req.body };
    if (req.body.categories) {
      try { memoryData.categories = JSON.parse(req.body.categories); } catch (e) { memoryData.categories = []; }
    }
    if (req.files && req.files['coverPhoto']) {
      memoryData.coverPhoto = fileToBase64(req.files['coverPhoto'][0]);
    }
    if (req.files && req.files['photos']) {
      memoryData.photos = req.files['photos'].map(fileToBase64);
    }
    const updated = await Memory.findByIdAndUpdate(req.params.id, memoryData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/memories/:id', async (req, res) => {
  try {
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas - Gifts
app.post('/api/gifts', upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'photos', maxCount: 10 }]), async (req, res) => {
  try {
    const giftData = { ...req.body };
    if (req.files && req.files['coverPhoto']) {
      giftData.coverPhoto = fileToBase64(req.files['coverPhoto'][0]);
    }
    if (req.files && req.files['photos']) {
      giftData.photos = req.files['photos'].map(fileToBase64);
    }
    const gift = new Gift(giftData);
    await gift.save();
    res.status(201).json(gift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gifts', async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  try {
    const gifts = await Gift.find(filter).sort({ createdAt: -1 });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gifts/:id', async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gift deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas - Plans
app.post('/api/plans', upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'photos', maxCount: 10 }]), async (req, res) => {
  try {
    const planData = { ...req.body };
    if (req.files && req.files['coverPhoto']) {
      planData.coverPhoto = fileToBase64(req.files['coverPhoto'][0]);
    }
    if (req.files && req.files['photos']) {
      planData.photos = req.files['photos'].map(fileToBase64);
    }
    const plan = new Plan(planData);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ date: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
