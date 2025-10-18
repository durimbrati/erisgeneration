const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const activeTokens = {};


const app = express();
const PORT = 8080;
app.use(express.json({ limit: '10mb' })); // or '20mb' if needed
const users = {
  durim: 'durim',
  admin: 'admin',
  eris: 'eris2024'
};

app.use(express.static('docs'));
app.use('/uploads', express.static(path.join(__dirname, 'docs/uploads')));

const projectsPath = path.join(__dirname, 'docs/projects.json');
const uploadDir = path.join(__dirname, 'docs/uploads');

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
});
// app.post('/login', express.json(), (req, res) => {
  // const { username, password } = req.body;

  // if (users[username] && users[username] === password) {
    // res.json({ success: true, user: username });
  // } else {
    // res.status(401).json({ success: false, message: 'Invalid username or password' });
  // }
// });
app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens[token] = username;
    res.json({ success: true, user: username, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token && activeTokens[token]) {
    req.user = activeTokens[token];
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/api/projects', (req, res) => {
  fs.readFile(projectsPath, (err, data) => {
    if (err) return res.status(500).send('Error loading projects');
    res.json(JSON.parse(data));
  });
});

// app.post('/api/projects', (req, res) => {
  // fs.writeFile(projectsPath, JSON.stringify(req.body, null, 2), err => {
    // if (err) return res.status(500).send('Error saving projects');
    // res.send('Projects saved');
  // });
// });

// app.post('/api/upload', upload.array('images'), (req, res) => {
  // const filenames = req.files.map(f => f.filename);
  // res.json({ uploaded: filenames });
// });

// app.post('/api/delete-image', (req, res) => {
  // const { filename } = req.body;
  // const filePath = path.join(uploadDir, filename);
  // fs.unlink(filePath, err => {
    // if (err) return res.status(500).send('Error deleting image');
    // res.send('Image deleted');
  // });
// });
app.post('/api/projects', verifyToken, (req, res) => {
  fs.writeFile(projectsPath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).send('Error saving projects');
    res.send('Projects saved');
  });
});

// app.post('/api/upload', verifyToken, upload.array('images'), (req, res) => {
  // const filenames = req.files.map(f => f.filename);
  // res.json({ uploaded: filenames });
// });
app.post('/api/upload', verifyToken, upload.array('images'), (req, res) => {
  const filenames = req.files.map(f => f.filename);
  res.json({ uploaded: filenames });
});

app.post('/api/delete-image', verifyToken, (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(uploadDir, filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).send('Error deleting image');
    res.send('Image deleted');
  });
});


const nodemailer = require('nodemailer');
app.use(express.json()); // Make sure this is included

app.post('/api/contact', (req, res) => {
  const { name, email, phone, location, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your hosting SMTP later
    auth: {
      user: 'erisgenerationltd@gmail.com',
      pass: 'cklh kfee exro wgzx' // Use Gmail App Password if 2FA is on
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'erisgenerationltd@gmail.com',
    subject: `New Contact Request from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Message:
${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    res.json({ message: 'Email sent successfully' });
  });
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
