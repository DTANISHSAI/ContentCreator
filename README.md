# �� AI Image Generator Website

A stunning, modern AI image generator website with real AI-powered image generation capabilities. Features beautiful animations, multiple style options, and integration with leading AI image generation APIs.

## ✨ Features

- **Real AI Image Generation** - Powered by Stability AI or Hugging Face
- **Multiple Art Styles** - Realistic, Artistic, Cartoon, and Abstract
- **Beautiful UI/UX** - Modern glassmorphism design with smooth animations
- **Responsive Design** - Works perfectly on desktop and mobile
- **Download & Share** - Save and share your generated images
- **Gallery View** - Browse through generated images
- **Loading Animations** - Engaging user experience during generation

## 🚀 Quick Start

### 1. Clone or Download
Download all files to your local machine.

### 2. Configure API Keys

#### Option A: Stability AI (Recommended - High Quality)
1. Sign up at [Stability AI Platform](https://platform.stability.ai/)
2. Get your API key from the dashboard
3. Open `config.js` and update:
```javascript
STABILITY: {
    API_KEY: 'your-actual-stability-api-key-here',
    // ... other settings
}
```

#### Option B: Hugging Face (Free - Good Quality)
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Get your API token from [Settings](https://huggingface.co/settings/tokens)
3. Open `config.js` and update:
```javascript
HUGGINGFACE: {
    API_KEY: 'your-actual-huggingface-api-key-here',
    // ... other settings
}
```

### 3. Choose Your API
In `config.js`, set your preferred API:
```javascript
ACTIVE_API: 'stability', // or 'huggingface'
```

### 4. Run the Website
Open `index.html` in your web browser or serve it using a local server.

## 🔧 Configuration

### API Settings
Edit `config.js` to customize:

- **API Selection**: Choose between Stability AI or Hugging Face
- **Image Quality**: Adjust width/height (default: 1024x1024)
- **Generation Timeout**: Set maximum wait time (default: 60 seconds)
- **Prompt Length**: Maximum prompt length (default: 500 characters)

### Style Customization
Modify `STYLE_CONFIGS` in `config.js` to customize how each style enhances prompts:

```javascript
realistic: {
    prefix: "highly detailed, photorealistic, professional photography, ",
    suffix: ", sharp focus, high resolution, 8k quality, masterpiece"
}
```

## 🎯 Usage

1. **Enter a Description**: Type what you want to generate (e.g., "a majestic dragon flying over mountains")
2. **Choose a Style**: Select from Realistic, Artistic, Cartoon, or Abstract
3. **Generate**: Click the "Generate Image" button
4. **Download/Share**: Use the action buttons to save or share your creation

## 💡 Tips for Better Results

### Writing Effective Prompts
- **Be Specific**: "A red sports car on a winding mountain road at sunset" vs "car"
- **Include Details**: Mention lighting, style, mood, composition
- **Use Style Keywords**: "photorealistic", "oil painting", "digital art", "anime style"

### Style Guidelines
- **Realistic**: Best for photos, landscapes, portraits
- **Artistic**: Great for creative interpretations, paintings, artistic styles
- **Cartoon**: Perfect for animated characters, cute illustrations
- **Abstract**: Ideal for modern art, geometric designs, creative concepts

## 🔒 API Costs & Limits

### Stability AI
- **Cost**: Pay-per-generation (typically $0.002-$0.01 per image)
- **Quality**: Very high quality, fast generation
- **Best For**: Professional use, high-quality outputs

### Hugging Face
- **Cost**: Free tier available
- **Quality**: Good quality, may have slower generation
- **Best For**: Testing, personal projects, budget-conscious users

## 🛠️ Technical Details

### File Structure
```
image-generator-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── config.js           # API configuration
└── README.md           # This file
```

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Stability AI, Hugging Face
- **Design**: Glassmorphism, CSS Grid, Flexbox
- **Animations**: CSS animations, JavaScript transitions

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🐛 Troubleshooting

### Common Issues

**"Please configure your API key"**
- Make sure you've added your API key to `config.js`
- Check that the API key is correct and active

**"Network error"**
- Check your internet connection
- Verify the API service is available
- Try switching between APIs in config.js

**"Failed to generate image"**
- Check the browser console for detailed error messages
- Verify your API key has sufficient credits/quota
- Try a simpler prompt

**Images not loading**
- Ensure you're running from a web server (not just opening the HTML file)
- Check browser console for CORS errors

### Debug Mode
Open browser console (F12) to see detailed error messages and API responses.

## 🎨 Customization

### Adding New Styles
1. Add style option to HTML
2. Add style configuration to `STYLE_CONFIGS` in `config.js`
3. Update the style selection logic in `script.js`

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New APIs
1. Add API configuration to `CONFIG` in `config.js`
2. Create a new generation function in `script.js`
3. Update the `generateAIImage` function to handle the new API

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the project!

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify your API configuration
4. Try switching between different APIs

---

**Happy Creating! 🎨✨** 