const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Redirect root to launcher
app.get('/', (req, res) => {
  res.redirect('/launcher.html');
});

// Launch voice assistant endpoint
app.post('/launch-voice', (req, res) => {
  try {
    // Start the Python script
    const pythonProcess = spawn('python', ['quanty.py'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Detach the process so it runs independently
    pythonProcess.unref();
    
    res.status(200).send('Voice assistant launched successfully');
  } catch (error) {
    console.error('Error launching voice assistant:', error);
    res.status(500).send('Failed to launch voice assistant');
  }
});

// Direct chat interface endpoint
app.get('/chat', (req, res) => {
  res.redirect('/chat-interface.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Launcher server running at http://localhost:${port}`);
  
  // Open the launcher in the default browser
  const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
  spawn(start, [`http://localhost:${port}`], { shell: true });
});

console.log('Press Ctrl+C to stop the server');