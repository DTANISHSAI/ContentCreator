// AI Image Generation Configuration
// Choose your preferred API by setting the ACTIVE_API to one of the options below

const CONFIG = {
    // Active API to use ('stability', 'huggingface', or 'demo')
    ACTIVE_API: 'huggingface',
    
    // Stability AI Configuration (Paid - High Quality)
    STABILITY: {
        API_KEY: 'YOUR_STABILITY_API_KEY', // Get from https://platform.stability.ai/
        API_URL: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        ENABLED: true
    },
    
    // Hugging Face Configuration (Free - Good Quality)
    HUGGINGFACE: {
        API_KEY: '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', // Get from https://huggingface.co/settings/tokens
        API_URL: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
        ENABLED: true
    },
    
    // Demo Configuration (Free - No API Key Required)
    DEMO: {
        API_KEY: 'demo',
        API_URL: 'https://api.unsplash.com/photos/random',
        ENABLED: true
    },
    
    // Image generation settings
    SETTINGS: {
        DEFAULT_WIDTH: 1024,
        DEFAULT_HEIGHT: 1024,
        MAX_PROMPT_LENGTH: 500,
        GENERATION_TIMEOUT: 60000 // 60 seconds
    }
};

// Style configurations for better AI prompts
const STYLE_CONFIGS = {
    realistic: {
        prefix: "highly detailed, photorealistic, professional photography, ",
        suffix: ", sharp focus, high resolution, 8k quality, masterpiece"
    },
    artistic: {
        prefix: "artistic, creative, painterly style, ",
        suffix: ", vibrant colors, artistic composition, masterpiece, trending on artstation"
    },
    cartoon: {
        prefix: "cartoon style, animated, cute, ",
        suffix: ", clean lines, bright colors, cartoon illustration, disney style"
    },
    abstract: {
        prefix: "abstract art, modern, contemporary, ",
        suffix: ", geometric shapes, artistic expression, abstract composition, modern art"
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, STYLE_CONFIGS };
} 