# 🚀 Quick Setup Guide

## Get Your AI Image Generator Working in 5 Minutes!

### Step 1: Choose Your API

**Option A: Stability AI (Recommended)**
- Go to [Stability AI Platform](https://platform.stability.ai/)
- Sign up for a free account
- Get your API key from the dashboard
- **Cost**: ~$0.002-$0.01 per image

**Option B: Hugging Face (Free)**
- Go to [Hugging Face](https://huggingface.co/)
- Sign up for a free account
- Get your API token from [Settings](https://huggingface.co/settings/tokens)
- **Cost**: Free tier available

### Step 2: Configure Your API Key

1. Open `config.js` in your code editor
2. Find the API configuration section
3. Replace the placeholder with your actual API key:

**For Stability AI:**
```javascript
STABILITY: {
    API_KEY: 'sk-your-actual-stability-api-key-here',
    // ... other settings
}
```

**For Hugging Face:**
```javascript
HUGGINGFACE: {
    API_KEY: 'hf-your-actual-huggingface-api-key-here',
    // ... other settings
}
```

### Step 3: Choose Your API

In the same `config.js` file, set which API you want to use:

```javascript
ACTIVE_API: 'stability', // or 'huggingface'
```

### Step 4: Test Your Setup

1. Open `index.html` in your web browser
2. Enter a prompt like "a beautiful sunset over mountains"
3. Choose a style (Realistic, Artistic, Cartoon, or Abstract)
4. Click "Generate Image"
5. Wait for your AI-generated image!

### Troubleshooting

**"Please configure your API key"**
- Make sure you've added your API key to `config.js`
- Check that the API key is correct

**"Network error"**
- Check your internet connection
- Verify the API service is available

**"Failed to generate image"**
- Check browser console (F12) for error details
- Verify your API key has sufficient credits
- Try a simpler prompt

### Tips for Best Results

1. **Be Specific**: "A red sports car on a winding mountain road at sunset" vs "car"
2. **Include Details**: Mention lighting, style, mood, composition
3. **Use Style Keywords**: "photorealistic", "oil painting", "digital art"

### API Comparison

| Feature | Stability AI | Hugging Face |
|---------|-------------|--------------|
| Quality | Very High | Good |
| Speed | Fast | Slower |
| Cost | Pay-per-use | Free tier |
| Best For | Professional use | Testing/Personal |

---

**That's it! Your AI image generator is ready to create amazing images! 🎨✨** 