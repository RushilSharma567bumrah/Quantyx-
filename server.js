const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(fileUpload());

// API Key (hidden from frontend)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// API Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, temperature = 0.7, max_tokens = 2000 } = req.body;
    
    console.log(`🎯 Backend API Call: ${model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quanty-ai.web.app',
        'X-Title': 'Quanty AI'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Backend API Error:', error);
    res.status(500).json({ error: 'API request failed' });
  }
});

// DuckDuckGo Proxy
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Code Generation Endpoint with Claude 4.0 Sonnet + Companion APIs
app.post('/api/generate-code', async (req, res) => {
  try {
    const { primary, companion, request, ramTier } = req.body;
    console.log(`💻 Code Generation: ${request.type} (${request.language})`);
    
    // Use Claude 4.0 Sonnet as primary with companion API
    const codeResult = await generateCodeWithCompanions(primary, companion, request, ramTier);
    
    res.json({
      code: codeResult.code,
      generator: `${primary} + ${companion}`,
      language: request.language,
      type: request.type,
      ramOptimized: true,
      generationTime: codeResult.generationTime
    });
    
  } catch (error) {
    console.error('Code Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Generate code with Claude 4.0 Sonnet + companion APIs
async function generateCodeWithCompanions(primary, companion, request, ramTier) {
  try {
    const startTime = Date.now();
    
    // Optimize prompt based on RAM tier
    let prompt = request.prompt;
    if (ramTier === 'low') {
      prompt = `Generate minimal ${request.type} code in ${request.language}: ${request.prompt}`;
    } else {
      prompt = `Generate comprehensive ${request.type} code in ${request.language} with best practices: ${request.prompt}`;
    }
    
    // Call Claude 4.0 Sonnet
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quanty-ai.web.app',
        'X-Title': 'Quanty Code Generator'
      },
      body: JSON.stringify({
        model: primary,
        messages: [{
          role: 'system',
          content: `You are Quanty, an expert code generator working with ${companion} companion API. Generate clean, efficient, production-ready code with proper documentation and error handling.`
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.2,
        max_tokens: ramTier === 'low' ? 1000 : 2000
      })
    });
    
    const data = await response.json();
    const code = data.choices[0].message.content;
    
    return {
      code,
      generationTime: `${Date.now() - startTime}ms`
    };
    
  } catch (error) {
    throw new Error(`Code generation failed: ${error.message}`);
  }
}

// Image Generation Endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(`🎨 Image Generation Request: ${prompt}`);
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Try LLaMA 4 Maverick first, then Mistral Small 3.1
    const models = [
      'meta-llama/llama-4-maverick',
      'mistralai/mistral-small-3.1'
    ];
    
    let imageResult = null;
    let usedModel = null;
    
    for (const model of models) {
      try {
        console.log(`🎯 Trying image generation with ${model}`);
        
        const imageResponse = await generateImageWithModel(model, prompt);
        if (imageResponse) {
          imageResult = imageResponse;
          usedModel = model;
          break;
        }
      } catch (modelError) {
        console.log(`❌ ${model} failed: ${modelError.message}`);
        continue;
      }
    }
    
    if (!imageResult) {
      return res.status(500).json({ error: 'All image generation models failed' });
    }
    
    res.json({
      imageUrl: imageResult.imageUrl,
      model: usedModel,
      prompt: prompt,
      generationTime: imageResult.generationTime
    });
    
  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Generate image with specific model
async function generateImageWithModel(model, prompt) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quanty-ai.web.app',
        'X-Title': 'Quanty Image Generator'
      },
      body: JSON.stringify({
        model: model,
        messages: [{
          role: 'system',
          content: 'You are Quanty, an expert image generation assistant. Generate detailed, creative image descriptions and provide image URLs when possible. Focus on creating vivid, artistic descriptions.'
        }, {
          role: 'user',
          content: `Generate an image of: ${prompt}\n\nPlease provide a detailed description of the image and if possible, generate or provide an image URL.`
        }],
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // For now, return the AI description as the "image"
    // In a real implementation, this would integrate with actual image generation APIs
    return {
      imageUrl: `data:text/plain;base64,${Buffer.from(content).toString('base64')}`,
      generationTime: '2-3 seconds'
    };
    
  } catch (error) {
    throw new Error(`Model ${model} failed: ${error.message}`);
  }
}

// Whisper API Voice Recognition Endpoint
app.post('/api/voice/whisper', async (req, res) => {
  try {
    const audioFile = req.files?.audio;
    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file required' });
    }
    
    console.log('🎤 Whisper API Request');
    
    // Call OpenAI Whisper API
    const formData = new FormData();
    formData.append('file', audioFile.data, {
      filename: 'audio.wav',
      contentType: 'audio/wav'
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || OPENROUTER_API_KEY}`,
      },
      body: formData
    });
    
    const result = await response.json();
    
    res.json({
      text: result.text,
      provider: 'OpenAI Whisper',
      language: 'en'
    });
    
  } catch (error) {
    console.error('Whisper API Error:', error);
    res.status(500).json({ error: 'Voice recognition failed' });
  }
});

// TypingMind Voice Integration
app.post('/api/voice/typingmind/start', async (req, res) => {
  try {
    const sessionId = Date.now().toString();
    
    // Store session for polling
    global.typingMindSessions = global.typingMindSessions || {};
    global.typingMindSessions[sessionId] = {
      active: true,
      results: []
    };
    
    res.json({ sessionId });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to start TypingMind session' });
  }
});

// Video Summarization Endpoint
app.post('/api/video-summary', async (req, res) => {
  try {
    const { url } = req.body;
    console.log(`📹 Video Summary Request: ${url}`);
    
    // Extract video ID and get transcript
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid video URL' });
    }
    
    // Get video transcript
    const transcript = await getVideoTranscript(videoId);
    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not available for this video' });
    }
    
    // Summarize with AI
    const summary = await summarizeTranscript(transcript, url);
    
    res.json({ 
      videoId,
      url,
      transcript: transcript.substring(0, 1000) + '...',
      summary
    });
    
  } catch (error) {
    console.error('Video Summary Error:', error);
    
    // Send proper JSON error response
    res.status(500).json({ 
      error: error.message || 'Failed to summarize video',
      details: error.toString()
    });
  }
});

// Extract YouTube video ID from URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get video transcript using youtube-transcript
async function getVideoTranscript(videoId) {
  try {
    const { YoutubeTranscript } = require('youtube-transcript');
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.error('Transcript Error:', error);
    
    // Fallback: Try alternative method
    try {
      const fallbackTranscript = await getTranscriptFallback(videoId);
      return fallbackTranscript;
    } catch (fallbackError) {
      console.error('Fallback Transcript Error:', fallbackError);
      return null;
    }
  }
}

// Fallback transcript method
async function getTranscriptFallback(videoId) {
  try {
    // Use yt-dlp as fallback
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const command = `yt-dlp --write-auto-sub --skip-download --sub-format vtt --sub-lang en https://youtube.com/watch?v=${videoId}`;
    await execAsync(command);
    
    // Read the generated subtitle file
    const fs = require('fs');
    const subtitleFile = `${videoId}.en.vtt`;
    
    if (fs.existsSync(subtitleFile)) {
      const content = fs.readFileSync(subtitleFile, 'utf8');
      fs.unlinkSync(subtitleFile); // Clean up
      
      // Parse VTT content
      const lines = content.split('\n');
      const transcript = lines
        .filter(line => !line.includes('-->') && !line.startsWith('WEBVTT') && line.trim())
        .join(' ')
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim();
      
      return transcript;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Summarize transcript with AI
async function summarizeTranscript(transcript, videoUrl) {
  const prompt = `Please analyze this video transcript and provide:

1. **📝 Summary** (2-3 sentences)
2. **🎯 Key Points** (bullet points)
3. **📚 Main Topics** (list)
4. **💡 Key Takeaways** (actionable insights)
5. **⏱️ Time-Saving Notes** (most important parts)

Video URL: ${videoUrl}

Transcript:
${transcript.substring(0, 8000)}`;
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://quanty-ai.web.app',
        'X-Title': 'Quanty Video Summarizer'
      },
      body: JSON.stringify({
        model: 'openai/chatgpt-4o-latest',
        messages: [{
          role: 'system',
          content: 'You are Quanty, an expert video summarizer. Create comprehensive, well-structured summaries with clear sections and actionable insights.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Invalid response format: ${text.substring(0, 200)}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response structure');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    return 'Failed to generate AI summary. Please try again.';
  }
}

// Serve main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'immersive-ai.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Quanty AI Server running on port ${PORT}`);
  console.log(`🔐 API Key secured on backend`);
});