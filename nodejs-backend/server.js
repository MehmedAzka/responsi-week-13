const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

const cvFilePath = path.join(__dirname, 'data', 'cv.json')
const assetsPath = path.join(__dirname, 'data', 'assets')
const publicPath = path.join(__dirname, 'public')
const indexPath = path.join(publicPath, 'index.html')

app.use(cors())
app.use(express.json())

app.use('/assets', express.static(assetsPath))

function readCvData() {
  const file = fs.readFileSync(cvFilePath, 'utf-8')
  return JSON.parse(file)
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server aktif',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/cv', (req, res) => {
  try {
    const cvData = readCvData()

    res.json({
      success: true,
      message: 'Data CV berhasil diambil',
      data: cvData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membaca data CV',
      error: error.message,
    })
  }
})

app.use(express.static(publicPath))

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint API tidak ditemukan',
    })
  }

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath)
  }

  return res.json({
    success: true,
    message: 'Backend CV Express.js berjalan. Untuk melihat frontend, jalankan React di http://localhost:5173 atau build frontend terlebih dahulu.',
    endpoints: {
      health: '/api/health',
      cv: '/api/cv',
      photo: '/assets/photo.jpg',
    },
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
  console.log(`API CV: http://localhost:${PORT}/api/cv`)
  console.log(`Foto: http://localhost:${PORT}/assets/photo.jpg`)
})