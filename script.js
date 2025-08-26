// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const generatedImage = document.getElementById('generatedImage');
const resultImage = document.getElementById('resultImage');
const loadingModal = document.getElementById('loadingModal');
const styleOptions = document.querySelectorAll('.style-option');
const navLinks = document.querySelectorAll('.nav-link');

// New DOM Elements for Text Generation
const textPromptInput = document.getElementById('textPromptInput');
const generateTextBtn = document.getElementById('generateTextBtn');
const tabButtons = document.querySelectorAll('.tab-button');
const displayContainers = document.querySelectorAll('.display-container');
const textOptions = document.querySelectorAll('.text-option');

// Animation and Interaction Variables
let isGenerating = false;
let selectedStyle = 'realistic';
let selectedTextType = 'creative';

let currentTab = 'image';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupEventListeners();
    setupScrollAnimations();
    setupParallaxEffects();
    checkAPIKey();
    
    // Show image tab by default
    document.getElementById('imageDisplay').style.display = 'block';
    document.getElementById('imageGenerator').style.display = 'block';
    
    showNotification('🚀 Welcome to AI Content Creator!', 'success');
});

// Check if API key is configured
function checkAPIKey() {
    const activeConfig = CONFIG[CONFIG.ACTIVE_API.toUpperCase()];
    
    if (CONFIG.ACTIVE_API === 'demo') {
        showNotification('🎨 Demo mode active - Using free image search', 'info');
        return;
    }
    
    if (activeConfig.API_KEY === `YOUR_${CONFIG.ACTIVE_API.toUpperCase()}_API_KEY`) {
        showNotification(`⚠️ Please configure your ${CONFIG.ACTIVE_API} API key in config.js`, 'error');
        console.log(`To use real AI image generation, get your API key from:`);
        if (CONFIG.ACTIVE_API === 'stability') {
            console.log('https://platform.stability.ai/');
        } else if (CONFIG.ACTIVE_API === 'huggingface') {
            console.log('https://huggingface.co/settings/tokens');
        }
    }
}

// Initialize animations
function initializeAnimations() {
    // Animate floating shapes with different speeds
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * -5}s`;
        shape.style.animationDuration = `${20 + index * 5}s`;
    });

    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.hero-content, .generator-container, .gallery-item');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Generate button click
    generateBtn.addEventListener('click', handleGenerateClick);
    
    // Text generate button
    generateTextBtn?.addEventListener('click', handleTextGenerateClick);
    
    // Style option selection
    styleOptions.forEach(option => {
        option.addEventListener('click', handleStyleSelection);
    });
    
    // Text option selection
    textOptions.forEach(option => {
        option.addEventListener('click', handleTextTypeSelection);
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabSwitch);
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Input animations
    promptInput.addEventListener('focus', handleInputFocus);
    promptInput.addEventListener('blur', handleInputBlur);
    promptInput.addEventListener('input', handleInputChange);
    
    // Text input animations
    textPromptInput?.addEventListener('focus', handleInputFocus);
    textPromptInput?.addEventListener('blur', handleInputBlur);
    textPromptInput?.addEventListener('input', handleInputChange);
    
    // Download and share buttons
    document.querySelector('.download-btn')?.addEventListener('click', handleDownload);
    document.querySelector('.share-btn')?.addEventListener('click', handleShare);
    
    // Text action buttons
    document.querySelector('.copy-text-btn')?.addEventListener('click', handleTextCopy);
    
    // Gallery item clicks
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', handleGalleryItemClick);
    });
}

// Handle generate button click
async function handleGenerateClick() {
    if (isGenerating) return;
    
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a description for your image', 'error');
        return;
    }
    
    const activeConfig = CONFIG[CONFIG.ACTIVE_API.toUpperCase()];
    
    if (CONFIG.ACTIVE_API === 'demo') {
        // Demo mode doesn't need API key validation
        return;
    }
    
    if (activeConfig.API_KEY === `YOUR_${CONFIG.ACTIVE_API.toUpperCase()}_API_KEY`) {
        showNotification(`Please configure your ${CONFIG.ACTIVE_API} API key first`, 'error');
        return;
    }
    
    isGenerating = true;
    generateBtn.classList.add('loading');
    showLoadingModal();
    
    try {
        // Generate real AI image
        const imageUrl = await generateAIImage(prompt, selectedStyle);
        
        // Display the generated image
        displayGeneratedImage(imageUrl, prompt, selectedStyle);
        
        // Show generation info
        if (CONFIG.ACTIVE_API === 'demo') {
            showNotification('📸 Found relevant image from Unsplash', 'info');
        } else {
            showNotification('🎨 AI-generated image created', 'success');
        }
        
        // Show success animation
        showNotification('🎨 Image generated successfully!', 'success');
        
    } catch (error) {
        console.error('Image generation error:', error);
        showNotification(`Failed to generate image: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateBtn.classList.remove('loading');
        hideLoadingModal();
    }
}

// Generate AI image using configured API
async function generateAIImage(prompt, style) {
    const styleConfig = STYLE_CONFIGS[style];
    const enhancedPrompt = styleConfig.prefix + prompt + styleConfig.suffix;
    
    if (CONFIG.ACTIVE_API === 'stability') {
        return await generateWithStabilityAI(enhancedPrompt, style);
    } else if (CONFIG.ACTIVE_API === 'huggingface') {
        return await generateWithHuggingFace(enhancedPrompt);
    } else if (CONFIG.ACTIVE_API === 'demo') {
        return await generateWithDemo(enhancedPrompt);
    } else {
        throw new Error('Invalid API configuration');
    }
}

// Generate with Stability AI
async function generateWithStabilityAI(prompt, style) {
    const requestBody = {
        text_prompts: [
            {
                text: prompt,
                weight: 1
            }
        ],
        cfg_scale: 7,
        height: CONFIG.SETTINGS.DEFAULT_HEIGHT,
        width: CONFIG.SETTINGS.DEFAULT_WIDTH,
        samples: 1,
        steps: 30,
        style_preset: style === 'realistic' ? 'photographic' : 
                     style === 'artistic' ? 'cinematic' : 
                     style === 'cartoon' ? 'anime' : 'digital-art'
    };

    try {
        const response = await fetch(CONFIG.STABILITY.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.STABILITY.API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.artifacts && result.artifacts.length > 0) {
            // Convert base64 to blob URL
            const base64Image = result.artifacts[0].base64;
            const byteCharacters = atob(base64Image);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });
            return URL.createObjectURL(blob);
        } else {
            throw new Error('No image generated');
        }
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

// Generate with Hugging Face
async function generateWithHuggingFace(prompt) {
    try {
        const response = await fetch(CONFIG.HUGGINGFACE.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.HUGGINGFACE.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            // If we get a permission error, try the demo mode as fallback
            if (response.status === 403 || response.status === 401) {
                console.log('API permission error, falling back to demo mode');
                showNotification('🔄 Using image search as fallback', 'info');
                return await generateWithDemo(prompt);
            }
            
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Hugging Face returns the image directly as a blob
        const blob = await response.blob();
        return URL.createObjectURL(blob);
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

// Generate with Demo (Free images from Unsplash)
async function generateWithDemo(prompt) {
    try {
        // Enhanced keyword extraction with better mapping
        const styleKeywords = {
            realistic: ['photography', 'realistic', 'detailed', 'professional'],
            artistic: ['art', 'painting', 'artistic', 'creative', 'digital art'],
            cartoon: ['cartoon', 'animated', 'illustration', 'cute', 'drawing'],
            abstract: ['abstract', 'modern', 'art', 'geometric', 'contemporary']
        };
        
        // Enhanced prompt processing
        let processedPrompt = prompt.toLowerCase();
        
        // Remove AI-specific terms that don't help with image search
        const aiTerms = /highly detailed|photorealistic|professional photography|sharp focus|high resolution|8k quality|masterpiece|artistic|creative|painterly style|vibrant colors|artistic composition|trending on artstation|cartoon style|animated|cute|clean lines|bright colors|cartoon illustration|disney style|abstract art|modern|contemporary|geometric shapes|artistic expression|abstract composition|modern art/gi;
        processedPrompt = processedPrompt.replace(aiTerms, '');
        
        // Extract meaningful keywords
        let keywords = processedPrompt
            .replace(/[^\w\s]/g, ' ')
            .split(' ')
            .filter(word => word.length > 2 && !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'].includes(word))
            .slice(0, 5);
        
        // Add style-specific keywords
        const currentStyle = selectedStyle;
        if (styleKeywords[currentStyle]) {
            keywords = [...keywords, ...styleKeywords[currentStyle]];
        }
        
        // Create multiple search queries for better results
        const searchQueries = [
            keywords.join(' '),
            keywords.slice(0, 3).join(' '), // Shorter query
            keywords.slice(0, 2).join(' ') + ' ' + styleKeywords[currentStyle][0] // Style-focused
        ];
        
        console.log('Trying search queries:', searchQueries);
        
        // Try multiple search queries
        for (let query of searchQueries) {
            if (query.trim().length < 2) continue;
            
            try {
                const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&count=10`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Client-ID 896d4f52c589547b2134bd75ed48742db637fa51810b49b607e37e46ab2c0043'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        // Pick the best image based on relevance
                        const bestImage = data.find(img => 
                            img.description && 
                            img.description.toLowerCase().includes(keywords[0]) ||
                            img.alt_description && 
                            img.alt_description.toLowerCase().includes(keywords[0])
                        ) || data[0];
                        
                        return bestImage.urls.regular;
                    }
                }
            } catch (e) {
                console.log('Search query failed:', query, e);
                continue;
            }
        }
        
        // Final fallback with broader search
        const fallbackQueries = ['nature', 'landscape', 'art', 'photography'];
        for (let fallbackQuery of fallbackQueries) {
            try {
                const fallbackResponse = await fetch(`https://api.unsplash.com/photos/random?query=${fallbackQuery}&orientation=landscape`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Client-ID 896d4f52c589547b2134bd75ed48742db637fa51810b49b607e37e46ab2c0043'
                    }
                });
                const fallbackData = await fallbackResponse.json();
                return fallbackData.urls.regular;
            } catch (e) {
                continue;
            }
        }
        
        throw new Error('No suitable images found');
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

// Display generated image with animations
function displayGeneratedImage(imageUrl, prompt, style) {
    const placeholder = document.querySelector('.placeholder-image');
    const generatedImageDiv = document.getElementById('generatedImage');
    
    // Hide placeholder with animation
    placeholder.style.opacity = '0';
    placeholder.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        placeholder.style.display = 'none';
        generatedImageDiv.style.display = 'block';
        
        // Set image source
        resultImage.src = imageUrl;
        resultImage.alt = `Generated image: ${prompt}`;
        
        // Show image with animation
        resultImage.style.opacity = '0';
        resultImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            resultImage.style.transition = 'all 0.5s ease-out';
            resultImage.style.opacity = '1';
            resultImage.style.transform = 'scale(1)';
        }, 100);
        
        // Animate action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(20px)';
                btn.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    btn.style.opacity = '1';
                    btn.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
        
    }, 300);
}

// Handle tab switching
function handleTabSwitch(event) {
    const clickedTab = event.currentTarget;
    const tabName = clickedTab.dataset.tab;
    
    // Remove active class from all tabs
    tabButtons.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    clickedTab.classList.add('active');
    
    // Hide all generator containers
    document.querySelectorAll('.generator-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Show selected generator container
    document.getElementById(`${tabName}Generator`).style.display = 'block';
    
    // Hide all display containers
    displayContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // Show selected display container
    document.getElementById(`${tabName}Display`).style.display = 'block';
    
    currentTab = tabName;
    
    // Add visual feedback
    showNotification(`Switched to ${tabName} generation`, 'info');
}

// Handle text type selection
function handleTextTypeSelection(event) {
    const clickedOption = event.currentTarget;
    const type = clickedOption.dataset.type;
    
    // Remove active class from all options
    textOptions.forEach(option => {
        option.classList.remove('active');
        option.style.transform = 'scale(1)';
    });
    
    // Add active class to clicked option
    clickedOption.classList.add('active');
    clickedOption.style.transform = 'scale(1.05)';
    
    // Reset transform after animation
    setTimeout(() => {
        clickedOption.style.transform = 'scale(1)';
    }, 200);
    
    selectedTextType = type;
    
    // Add visual feedback
    showNotification(`Text type changed to: ${type}`, 'info');
}



// Handle style selection
function handleStyleSelection(event) {
    const clickedOption = event.currentTarget;
    const style = clickedOption.dataset.style;
    
    // Remove active class from all options
    styleOptions.forEach(option => {
        option.classList.remove('active');
        option.style.transform = 'scale(1)';
    });
    
    // Add active class to clicked option
    clickedOption.classList.add('active');
    clickedOption.style.transform = 'scale(1.05)';
    
    // Reset transform after animation
    setTimeout(() => {
        clickedOption.style.transform = 'scale(1)';
    }, 200);
    
    selectedStyle = style;
    
    // Add visual feedback
    showNotification(`Style changed to: ${style}`, 'info');
}

// Handle navigation clicks
function handleNavClick(event) {
    event.preventDefault();
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    event.currentTarget.classList.add('active');
    
    // Smooth scroll to section
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle input focus
function handleInputFocus(event) {
    const wrapper = event.target.parentElement;
    wrapper.style.transform = 'scale(1.02)';
    wrapper.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3)';
}

// Handle input blur
function handleInputBlur(event) {
    const wrapper = event.target.parentElement;
    wrapper.style.transform = 'scale(1)';
    wrapper.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
}

// Handle input change
function handleInputChange(event) {
    const text = event.target.value;
    const generateBtn = document.getElementById('generateBtn');
    
    if (text.trim().length > 0) {
        generateBtn.style.opacity = '1';
        generateBtn.style.transform = 'scale(1)';
    } else {
        generateBtn.style.opacity = '0.7';
        generateBtn.style.transform = 'scale(0.95)';
    }
}

// Show loading modal
function showLoadingModal() {
    loadingModal.style.display = 'flex';
    loadingModal.style.opacity = '0';
    
    setTimeout(() => {
        loadingModal.style.transition = 'opacity 0.3s ease-out';
        loadingModal.style.opacity = '1';
    }, 10);
}

// Hide loading modal
function hideLoadingModal() {
    loadingModal.style.opacity = '0';
    
    setTimeout(() => {
        loadingModal.style.display = 'none';
    }, 300);
}

// Handle text generation
async function handleTextGenerateClick() {
    if (isGenerating) return;
    
    const prompt = textPromptInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a description for your text', 'error');
        return;
    }
    
    isGenerating = true;
    generateTextBtn.classList.add('loading');
    showLoadingModal();
    
    try {
        // Generate text using AI
        const generatedText = await generateAIText(prompt, selectedTextType);
        
        // Display the generated text
        displayGeneratedText(generatedText, prompt, selectedTextType);
        
        showNotification('📝 Text generated successfully!', 'success');
        
    } catch (error) {
        console.error('Text generation error:', error);
        showNotification(`Failed to generate text: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateTextBtn.classList.remove('loading');
        hideLoadingModal();
    }
}




// Generate AI text
async function generateAIText(prompt, type) {
    // Clean and analyze the prompt
    const cleanPrompt = prompt.trim().toLowerCase();
    const words = cleanPrompt.split(' ').filter(word => word.length > 2);
    
    // Analyze prompt context and extract key concepts
    const promptAnalysis = analyzePrompt(cleanPrompt, words);
    
    // Generate contextually relevant content based on the prompt analysis
    let generatedText = '';
    
    if (type === 'creative') {
        generatedText = generateCreativeText(prompt, promptAnalysis);
    } else if (type === 'professional') {
        generatedText = generateProfessionalText(prompt, promptAnalysis);
    } else if (type === 'casual') {
        generatedText = generateCasualText(prompt, promptAnalysis);
    } else if (type === 'academic') {
        generatedText = generateAcademicText(prompt, promptAnalysis);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return generatedText;
}

// Analyze prompt to understand context and extract key concepts
function analyzePrompt(prompt, words) {
    const analysis = {
        topic: '',
        category: '',
        keywords: [],
        complexity: 'medium',
        tone: 'neutral'
    };
    
    // Extract main topic (first meaningful word)
    analysis.topic = words[0] || 'topic';
    
    // Categorize the prompt
    const categories = {
        technology: ['app', 'website', 'software', 'program', 'code', 'system', 'platform', 'database', 'api', 'algorithm'],
        business: ['business', 'company', 'startup', 'marketing', 'strategy', 'plan', 'project', 'team', 'product', 'service'],
        creative: ['story', 'poem', 'art', 'design', 'creative', 'imagination', 'fantasy', 'adventure', 'character', 'world'],
        education: ['learning', 'study', 'education', 'course', 'lesson', 'tutorial', 'guide', 'explanation', 'concept', 'theory'],
        lifestyle: ['health', 'fitness', 'cooking', 'travel', 'fashion', 'beauty', 'home', 'garden', 'hobby', 'sport']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => prompt.includes(keyword))) {
            analysis.category = category;
            break;
        }
    }
    
    // Extract relevant keywords
    analysis.keywords = words.filter(word => 
        word.length > 3 && 
        !['what', 'how', 'why', 'when', 'where', 'this', 'that', 'with', 'from', 'into', 'during', 'before', 'after', 'above', 'below'].includes(word)
    ).slice(0, 5);
    
    // Determine complexity based on prompt length and vocabulary
    if (words.length > 10 || prompt.includes('advanced') || prompt.includes('complex')) {
        analysis.complexity = 'high';
    } else if (words.length < 5) {
        analysis.complexity = 'low';
    }
    
    // Determine tone
    if (prompt.includes('fun') || prompt.includes('creative') || prompt.includes('exciting')) {
        analysis.tone = 'enthusiastic';
    } else if (prompt.includes('serious') || prompt.includes('professional') || prompt.includes('formal')) {
        analysis.tone = 'formal';
    }
    
    return analysis;
}

// Generate creative text based on prompt analysis
function generateCreativeText(prompt, analysis) {
    const creativeTemplates = {
        technology: `🚀 **Creative Tech Vision: ${prompt}**

Imagine a world where ${analysis.topic} isn't just a concept—it's a living, breathing digital ecosystem that transforms how we interact with technology.

**The Vision:**
Picture ${prompt} as a canvas where innovation meets imagination. It's not about building another ${analysis.topic} system; it's about creating an experience that feels like magic in your hands.

**The Creative Journey:**
Every line of code, every pixel, every interaction becomes a brushstroke on this digital masterpiece. ${analysis.keywords.join(', ')} aren't just features—they're the colors that bring your vision to life.

**The Magic:**
What makes this ${analysis.topic} special is how it makes the complex feel simple, the ordinary feel extraordinary. It's like having a conversation with the future, where every click reveals a new possibility.

**The Promise:**
This isn't just about ${prompt}—it's about unlocking the creative potential that lives inside every developer, designer, and dreamer who dares to imagine what could be.

Let your creativity flow and watch as ${prompt} becomes more than words on a screen—it becomes a gateway to infinite possibilities. ✨`,

        business: `💼 **Creative Business Innovation: ${prompt}**

In the dynamic world of business, ${prompt} represents more than just another strategy—it's a creative revolution waiting to happen.

**The Creative Opportunity:**
Think of ${analysis.topic} as a blank canvas where traditional business thinking meets innovative creativity. It's not about following the same old playbook; it's about rewriting the rules of success.

**The Innovation Journey:**
Every decision, every strategy, every customer interaction becomes an opportunity to create something extraordinary. ${analysis.keywords.join(', ')} aren't just business elements—they're the building blocks of a new business paradigm.

**The Creative Edge:**
What sets this ${analysis.topic} apart is its ability to turn challenges into opportunities, problems into solutions, and ideas into reality. It's like having a creative compass that always points toward innovation.

**The Vision:**
This isn't just about ${prompt}—it's about creating a business ecosystem where creativity drives growth, innovation fuels success, and imagination becomes your competitive advantage.

Embrace the creative spirit and watch as ${prompt} transforms from a business concept into a creative masterpiece that inspires and innovates. 🎨`,

        creative: `🎭 **Creative Expression: ${prompt}**

Welcome to the realm of pure creativity, where ${prompt} becomes a gateway to infinite artistic possibilities and boundless imagination.

**The Creative Canvas:**
${analysis.topic} isn't just a subject—it's a universe of creative potential waiting to be explored. Every word, every image, every moment becomes a brushstroke on the canvas of your imagination.

**The Artistic Journey:**
Picture ${prompt} as a story that writes itself, a painting that paints itself, a song that sings itself. ${analysis.keywords.join(', ')} aren't just elements—they're the colors, sounds, and textures that bring your creative vision to life.

**The Magic of Creation:**
What makes this ${analysis.topic} extraordinary is how it transforms the ordinary into the extraordinary, the mundane into the magical. It's like having a creative genie that grants unlimited wishes for artistic expression.

**The Creative Promise:**
This isn't just about ${prompt}—it's about unlocking the creative genius that lives inside every artist, writer, musician, and dreamer who dares to imagine the impossible.

Let your imagination soar and watch as ${prompt} becomes a masterpiece of creative expression that inspires and delights. 🌟`,

        default: `✨ **Creative Exploration: ${prompt}**

Step into a world where ${prompt} becomes more than words—it becomes a journey of creative discovery and boundless imagination.

**The Creative Adventure:**
${analysis.topic} isn't just a topic; it's a doorway to infinite possibilities. Every aspect, every detail, every nuance becomes an opportunity to explore, create, and innovate.

**The Imagination Journey:**
Picture ${prompt} as a canvas where your thoughts become reality, your ideas become art, and your dreams become tangible. ${analysis.keywords.join(', ')} aren't just concepts—they're the building blocks of creative expression.

**The Creative Magic:**
What makes this ${analysis.topic} special is how it transforms the ordinary into the extraordinary. It's like having a creative key that unlocks doors to worlds you never knew existed.

**The Creative Promise:**
This isn't just about ${prompt}—it's about discovering the creative potential that lives within you, waiting to be unleashed and expressed in ways that inspire and amaze.

Embrace your creative spirit and watch as ${prompt} becomes a masterpiece of imagination and innovation. 🎨`
    };
    
    return creativeTemplates[analysis.category] || creativeTemplates.default;
}

// Generate professional text based on prompt analysis
function generateProfessionalText(prompt, analysis) {
    const professionalTemplates = {
        technology: `🔧 **Professional Technical Analysis: ${prompt}**

**Executive Summary:**
This comprehensive technical analysis examines the implementation and strategic implications of ${prompt} within modern technology ecosystems. The analysis provides actionable insights for technical teams, product managers, and stakeholders.

**Technical Assessment:**
• **Architecture Considerations**: ${analysis.topic} requires a robust, scalable architecture that can handle ${analysis.complexity === 'high' ? 'complex, enterprise-level' : 'standard'} requirements
• **Technology Stack**: Recommended implementation using modern frameworks and best practices
• **Performance Metrics**: Key performance indicators and optimization strategies for ${analysis.topic}

**Implementation Strategy:**
1. **Phase 1**: Technical requirements gathering and architecture design
2. **Phase 2**: Core development and integration testing
3. **Phase 3**: Performance optimization and security hardening
4. **Phase 4**: Deployment and monitoring implementation

**Risk Assessment:**
• Technical complexity: ${analysis.complexity === 'high' ? 'High - Requires specialized expertise' : 'Medium - Standard development practices'}
• Timeline: Estimated ${analysis.complexity === 'high' ? '6-12 months' : '3-6 months'} for full implementation
• Resource requirements: ${analysis.complexity === 'high' ? 'Senior development team with specialized skills' : 'Standard development team'}

**Recommendations:**
• Implement agile development methodology for iterative delivery
• Establish comprehensive testing protocols and quality assurance measures
• Develop detailed documentation and knowledge transfer processes
• Create monitoring and maintenance procedures for long-term success

**Next Steps:**
• Schedule technical review meeting within 2 weeks
• Begin requirements gathering and stakeholder interviews
• Develop detailed project timeline and resource allocation plan
• Establish success metrics and evaluation criteria`,

        business: `📊 **Professional Business Analysis: ${prompt}**

**Executive Summary:**
This comprehensive business analysis examines the strategic implications and market opportunities presented by ${prompt}. The analysis provides actionable insights for business leaders, stakeholders, and implementation teams.

**Market Analysis:**
• **Market Opportunity**: ${analysis.topic} represents a significant growth opportunity in the current business landscape
• **Competitive Landscape**: Analysis of existing solutions and market positioning opportunities
• **Target Audience**: Identification of key customer segments and market demographics

**Strategic Framework:**
1. **Market Positioning**: Develop unique value proposition and competitive differentiation
2. **Go-to-Market Strategy**: Create comprehensive launch and growth strategy
3. **Resource Allocation**: Determine optimal investment and resource distribution
4. **Risk Management**: Identify and mitigate potential business and market risks

**Financial Considerations:**
• Investment requirements: ${analysis.complexity === 'high' ? 'Significant capital investment required' : 'Moderate investment with potential for rapid ROI'}
• Revenue projections: Conservative and optimistic scenarios for market penetration
• Break-even analysis: Timeline for achieving profitability and positive cash flow

**Implementation Roadmap:**
• **Q1**: Market research and strategy development
• **Q2**: Pilot program and initial market testing
• **Q3**: Full market launch and growth acceleration
• **Q4**: Performance evaluation and strategy refinement

**Success Metrics:**
• Market penetration and customer acquisition rates
• Revenue growth and profitability metrics
• Customer satisfaction and retention rates
• Operational efficiency and cost optimization`,

        default: `📋 **Professional Analysis: ${prompt}**

**Executive Summary:**
This comprehensive analysis examines the strategic importance and implementation requirements of ${prompt} from multiple professional perspectives. The analysis provides actionable insights and strategic recommendations for stakeholders across various industries.

**Strategic Assessment:**
• **Business Impact**: ${analysis.topic} represents a significant opportunity for strategic development and market positioning
• **Implementation Complexity**: ${analysis.complexity === 'high' ? 'High complexity requiring specialized expertise and significant resources' : 'Medium complexity with standard implementation approaches'}
• **Market Potential**: Strong potential for growth and innovation in this area

**Key Findings:**
• Current market analysis indicates strong potential for growth and innovation
• Stakeholder engagement and cross-functional collaboration are essential for successful implementation
• Risk assessment reveals manageable challenges with proper planning and execution

**Strategic Recommendations:**
1. Conduct thorough market research to identify key opportunities and competitive advantages
2. Develop a comprehensive implementation roadmap with clear milestones and success metrics
3. Establish cross-departmental teams to ensure alignment and effective execution
4. Implement robust monitoring and evaluation frameworks to track progress and outcomes

**Implementation Timeline:**
• **Phase 1** (Months 1-2): Research and planning
• **Phase 2** (Months 3-6): Development and testing
• **Phase 3** (Months 7-8): Launch and initial evaluation
• **Phase 4** (Months 9-12): Optimization and scaling

**Next Steps:**
• Schedule stakeholder review meetings within the next 2 weeks
• Begin preliminary research and data collection phase
• Develop detailed project timeline and resource allocation plan
• Establish success metrics and evaluation criteria

This analysis demonstrates the strategic importance of ${prompt} and provides a foundation for informed decision-making and successful project execution.`
    };
    
    return professionalTemplates[analysis.category] || professionalTemplates.default;
}

// Generate casual text based on prompt analysis
function generateCasualText(prompt, analysis) {
    const casualTemplates = {
        technology: `😊 **Hey there, tech enthusiast!**

So you're interested in ${prompt}? That's awesome! Let me break this down in a way that's actually useful and not super technical.

**What's the deal with ${analysis.topic}?**
${analysis.topic} is one of those things that seems super complicated at first, but once you get the hang of it, it's actually pretty cool. Think of it like learning to ride a bike - scary at first, but totally doable!

**Here's what you need to know:**
• ${analysis.keywords.slice(0, 3).join(', ')} are the main things you'll be working with
• It's not as hard as it looks - promise!
• There are tons of resources out there to help you learn

**The cool part:**
What makes ${analysis.topic} interesting is how it can solve real problems. It's like having a superpower that lets you build things that actually help people. Pretty neat, right?

**My advice:**
Start small, don't get overwhelmed, and remember that every expert was once a beginner. ${prompt} might seem like a lot right now, but you've got this! 

Feel free to ask questions - there's no such thing as a stupid question when you're learning something new. 😄`,

        business: `💼 **Hey business-minded friend!**

So you want to know about ${prompt}? That's a smart move! Let me give you the lowdown without all the corporate jargon.

**What's ${analysis.topic} all about?**
${analysis.topic} is basically about making smart decisions that help your business grow. It's like having a roadmap that shows you where you want to go and how to get there.

**The key things to remember:**
• ${analysis.keywords.slice(0, 3).join(', ')} are your main focus areas
• It's about planning ahead, not just reacting to problems
• You don't need to be a business expert to get started

**Why it matters:**
Think of ${analysis.topic} as your business GPS. Without it, you're just driving around hoping to find your destination. With it, you have a clear path to success.

**The bottom line:**
${prompt} isn't rocket science - it's about being smart, planning ahead, and making good decisions. Start with the basics, build from there, and don't be afraid to ask for help.

You've got this! Business success is totally within your reach. 🚀`,

        default: `😊 **Hey there!**

So you want to know about ${prompt}? That's awesome! Let me break it down for you in a way that's easy to understand and actually useful.

**First off, what is ${analysis.topic}?**
${analysis.topic} is pretty interesting when you think about it. It's one of those things that seems simple at first, but the more you dig into it, the more fascinating it becomes. You know what I mean?

**Here's the thing:**
${prompt} isn't just about what it is on the surface. It's about how it connects to other things, how it affects people's lives, and why it matters in the grand scheme of things. Pretty cool, right?

**What makes it special:**
I think what makes ${analysis.topic} special is that it's relatable. Whether you're a beginner or an expert, there's always something new to discover about it. It's like having a conversation with an old friend who always has something interesting to share.

**My take:**
${prompt} is worth learning about because it opens up new possibilities and helps you understand the world better. Plus, it's actually pretty fun once you get into it!

Hope this gives you a good starting point! Let me know if you want me to dive deeper into any specific aspect of ${prompt}. There's always more to explore! 😄`
    };
    
    return casualTemplates[analysis.category] || casualTemplates.default;
}

// Generate academic text based on prompt analysis
function generateAcademicText(prompt, analysis) {
    const academicTemplates = {
        technology: `🎓 **Academic Research: ${prompt}**

**Abstract:**
This scholarly investigation examines the theoretical foundations and practical applications of ${prompt} within the context of modern technology and computer science. The research employs rigorous academic methodologies to provide comprehensive insights into the conceptual frameworks and implementation strategies of this technological domain.

**Literature Review:**
The existing body of knowledge on ${analysis.topic} reveals several key theoretical perspectives that inform contemporary understanding. Previous studies have established foundational principles that guide current research methodologies and analytical frameworks. The literature demonstrates significant gaps in understanding that warrant further investigation, particularly in areas of ${analysis.keywords.join(', ')}.

**Theoretical Framework:**
Our research approach utilizes established academic protocols, ensuring methodological rigor and reproducibility. The analytical framework incorporates peer-reviewed methodologies that have been validated through extensive empirical testing and cross-cultural validation studies. The theoretical foundation draws upon established principles in computer science, software engineering, and information systems.

**Methodological Approach:**
The research methodology employs a mixed-methods approach, combining qualitative analysis with quantitative assessment. Data collection methods include systematic literature review, expert interviews, and case study analysis. The analytical framework ensures comprehensive coverage of the research objectives while maintaining academic rigor.

**Key Research Questions:**
1. What are the fundamental theoretical principles underlying ${analysis.topic}?
2. How do current theoretical models account for observed technological phenomena?
3. What methodological approaches yield the most reliable and valid results in ${analysis.topic} research?
4. How can theoretical findings be applied to real-world technological contexts?

**Implications and Future Research:**
The findings of this study contribute to the broader academic discourse on ${prompt} and provide a foundation for future research initiatives. Further investigation is recommended in areas of theoretical development, methodological innovation, and practical application within the technology sector.`,

        business: `🎓 **Academic Research: ${prompt}**

**Abstract:**
This scholarly investigation examines the theoretical foundations and practical applications of ${prompt} within the context of modern business and management theory. The research employs rigorous academic methodologies to provide comprehensive insights into the conceptual frameworks and strategic implications of this business domain.

**Literature Review:**
The existing body of knowledge on ${analysis.topic} reveals several key theoretical perspectives that inform contemporary business understanding. Previous studies have established foundational principles that guide current research methodologies and analytical frameworks. The literature demonstrates significant gaps in understanding that warrant further investigation, particularly in areas of ${analysis.keywords.join(', ')}.

**Theoretical Framework:**
Our research approach utilizes established academic protocols, ensuring methodological rigor and reproducibility. The analytical framework incorporates peer-reviewed methodologies that have been validated through extensive empirical testing and cross-cultural validation studies. The theoretical foundation draws upon established principles in business management, strategic planning, and organizational theory.

**Methodological Approach:**
The research methodology employs a mixed-methods approach, combining qualitative analysis with quantitative assessment. Data collection methods include systematic literature review, expert interviews, and case study analysis. The analytical framework ensures comprehensive coverage of the research objectives while maintaining academic rigor.

**Key Research Questions:**
1. What are the fundamental theoretical principles underlying ${analysis.topic}?
2. How do current theoretical models account for observed business phenomena?
3. What methodological approaches yield the most reliable and valid results in ${analysis.topic} research?
4. How can theoretical findings be applied to real-world business contexts?

**Implications and Future Research:**
The findings of this study contribute to the broader academic discourse on ${prompt} and provide a foundation for future research initiatives. Further investigation is recommended in areas of theoretical development, methodological innovation, and practical application within the business sector.`,

        default: `🎓 **Academic Research: ${prompt}**

**Abstract:**
This scholarly investigation examines the multifaceted dimensions of ${prompt} through rigorous academic inquiry and systematic analysis. The research employs both qualitative and quantitative methodologies to provide comprehensive insights into the theoretical frameworks and practical applications of this subject matter.

**Literature Review:**
The existing body of knowledge on ${analysis.topic} reveals several key theoretical perspectives that inform contemporary understanding. Previous studies have established foundational principles that guide current research methodologies and analytical frameworks. The literature demonstrates significant gaps in understanding that warrant further investigation, particularly in areas of ${analysis.keywords.join(', ')}.

**Theoretical Framework:**
Our research approach utilizes established academic protocols, ensuring methodological rigor and reproducibility. The analytical framework incorporates peer-reviewed methodologies that have been validated through extensive empirical testing and cross-cultural validation studies. The theoretical foundation draws upon established principles in the relevant academic discipline.

**Methodological Approach:**
The research methodology employs a mixed-methods approach, combining qualitative analysis with quantitative assessment. Data collection methods include systematic literature review, expert interviews, and case study analysis. The analytical framework ensures comprehensive coverage of the research objectives while maintaining academic rigor.

**Key Research Questions:**
1. What are the fundamental principles underlying ${analysis.topic}?
2. How do current theoretical models account for observed phenomena?
3. What methodological approaches yield the most reliable and valid results?
4. How can findings be applied to real-world contexts and practical applications?

**Implications and Future Research:**
The findings of this study contribute to the broader academic discourse on ${prompt} and provide a foundation for future research initiatives. Further investigation is recommended in areas of theoretical development, methodological innovation, and practical application.`
    };
    
    return academicTemplates[analysis.category] || academicTemplates.default;
}





// Generate simple, appropriate code
function generateSimpleCode(prompt, language) {
    if (language === 'javascript') {
        generatedCode = `// ${prompt}
// Generated by AI Code Generator

/**
 * ${prompt.charAt(0).toUpperCase() + prompt.slice(1)} - A JavaScript solution
 * This code demonstrates best practices and modern JavaScript features
 */

class ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager {
    constructor() {
        this.data = new Map();
        this.isInitialized = false;
    }
    
    /**
     * Initialize the ${prompt} system
     * @param {Object} config - Configuration options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(config = {}) {
        try {
            this.isInitialized = true;
            console.log(\`${prompt} system initialized successfully\`);
            return true;
        } catch (error) {
            console.error(\`Failed to initialize ${prompt} system:\`, error);
            return false;
        }
    }
    
    /**
     * Process ${prompt} data
     * @param {*} input - Input data to process
     * @returns {Object} Processed result
     */
    process(input) {
        if (!this.isInitialized) {
            throw new Error('${prompt} system not initialized');
        }
        
        // Process the input based on ${prompt} requirements
        const processed = this.validateAndProcess(input);
        
        return {
            original: input,
            processed: processed,
            timestamp: new Date().toISOString(),
            metadata: {
                prompt: "${prompt}",
                language: "JavaScript",
                version: "1.0.0"
            }
        };
    }
    
    /**
     * Validate and process input data
     * @param {*} input - Input to validate
     * @returns {*} Processed data
     */
    validateAndProcess(input) {
        if (input === null || input === undefined) {
            throw new Error('Input cannot be null or undefined');
        }
        
        // Custom processing logic for ${prompt}
        if (typeof input === 'string') {
            return input.trim().toLowerCase();
        } else if (Array.isArray(input)) {
            return input.filter(item => item != null);
        } else if (typeof input === 'object') {
            return Object.keys(input).reduce((acc, key) => {
                if (input[key] != null) acc[key] = input[key];
                return acc;
            }, {});
        }
        
        return input;
    }
}

// Example usage
const ${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}Manager = new ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager();

// Initialize and use
${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}Manager.initialize()
    .then(() => {
        const result = ${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}Manager.process("Sample data for ${prompt}");
        console.log('Processing result:', result);
    })
    .catch(error => console.error('Error:', error));

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager };
}`;
        
    } else if (language === 'python') {
        generatedCode = `# ${prompt}
# Generated by AI Code Generator

"""
${prompt.charAt(0).toUpperCase() + prompt.slice(1)} - A Python solution
This code demonstrates best practices and modern Python features
"""

import datetime
import json
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class ${prompt.replace(' ', '_').replace('-', '_').replace('_', '').charAt(0).toUpperCase() + prompt.replace(' ', '_').replace('-', '_').replace('_', '').slice(1)}Config:
    """Configuration class for ${prompt} system"""
    debug_mode: bool = False
    max_retries: int = 3
    timeout: float = 30.0
    data_path: Optional[Path] = None
    
    def __post_init__(self):
        if self.data_path is None:
            self.data_path = Path.cwd() / "data" / "${prompt.replace(' ', '_').toLowerCase()}"

class ${prompt.replace(' ', '_').replace('-', '_').replace('_', '').charAt(0).toUpperCase() + prompt.replace(' ', '_').replace('-', '_').replace('_', '').slice(1)}Manager:
    """Main class for managing ${prompt} operations"""
    
    def __init__(self, config: Optional[${prompt.replace(' ', '_').replace('-', '_').replace('_', '').charAt(0).toUpperCase() + prompt.replace(' ', '_').replace('-', '_').replace('_', '').slice(1)}Config] = None):
        self.config = config or ${prompt.replace(' ', '_').replace('-', '_').replace('_', '').charAt(0).toUpperCase() + prompt.replace(' ', '_').replace('-', '_').replace('_', '').slice(1)}Config()
        self.is_initialized = False
        self.data_cache: Dict[str, Any] = {}
    
    async def initialize(self) -> bool:
        """Initialize the ${prompt} system"""
        try:
            # Ensure data directory exists
            self.config.data_path.mkdir(parents=True, exist_ok=True)
            
            self.is_initialized = True
            print(f"${prompt} system initialized successfully")
            return True
            
        except Exception as e:
            print(f"Failed to initialize ${prompt} system: {e}")
            return False
    
    def process(self, input_data: Any) -> Dict[str, Any]:
        """Process ${prompt} data"""
        if not self.is_initialized:
            raise RuntimeError("${prompt} system not initialized")
        
        # Process the input based on ${prompt} requirements
        processed_data = self._validate_and_process(input_data)
        
        return {
            "original": input_data,
            "processed": processed_data,
            "timestamp": datetime.datetime.now().isoformat(),
            "metadata": {
                "prompt": "${prompt}",
                "language": "Python",
                "version": "1.0.0"
            }
        }
    
    def _validate_and_process(self, input_data: Any) -> Any:
        """Validate and process input data"""
        if input_data is None:
            raise ValueError("Input cannot be None")
        
        # Custom processing logic for ${prompt}
        if isinstance(input_data, str):
            return input_data.strip().lower()
        elif isinstance(input_data, list):
            return [item for item in input_data if item is not None]
        elif isinstance(input_data, dict):
            return {k: v for k, v in input_data.items() if v is not None}
        
        return input_data

async def main():
    """Main function to demonstrate usage"""
    ${prompt.replace(' ', '_').toLowerCase()}_manager = ${prompt.replace(' ', '_').replace('-', '_').replace('_', '').charAt(0).toUpperCase() + prompt.replace(' ', '_').replace('-', '_').replace('_', '').slice(1)}Manager()
    
    # Initialize and use
    if await ${prompt.replace(' ', '_').toLowerCase()}_manager.initialize():
        result = ${prompt.replace(' ', '_').toLowerCase()}_manager.process(f"Sample data for {prompt}")
        print("Processing result:", json.dumps(result, indent=2))

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())`;
        
    } else if (language === 'html') {
        generatedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        /* Generated CSS for ${prompt} */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-title {
            font-size: 2.5rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-description {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 15px;
        }
        
        .feature-title {
            font-size: 1.1rem;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .feature-description {
            font-size: 0.9rem;
            opacity: 0.8;
            line-height: 1.4;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-button {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            margin-top: 20px;
        }
        
        .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
            .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-container {
                margin: 20px;
                padding: 30px;
            }
            
            .${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-title {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-container">
        <h1 class="${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-title">${prompt}</h1>
        <p class="${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-description">
            A beautiful, responsive web page generated specifically for "${prompt}". 
            This demonstrates modern web development practices with glassmorphism design.
        </p>
        
        <div class="${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-features">
            <div class="feature">
                <div class="feature-icon">🎨</div>
                <div class="feature-title">Modern Design</div>
                <div class="feature-description">Glassmorphism UI with smooth animations</div>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Responsive</div>
                <div class="feature-description">Works perfectly on all devices</div>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <div class="feature-title">Fast & Light</div>
                <div class="feature-description">Optimized for performance</div>
            </div>
        </div>
        
        <button class="${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-button" onclick="handle${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Action()">
            Explore ${prompt}
        </button>
    </div>
    
    <script>
        // JavaScript functionality for ${prompt}
        function handle${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Action() {
            alert('${prompt} action triggered! This is a demo of the generated functionality.');
        }
        
        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            const features = document.querySelectorAll('.feature');
            
            features.forEach((feature, index) => {
                feature.style.animationDelay = \`\${index * 0.1}s\`;
                feature.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });
        
        // CSS animation keyframes
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;
        
    } else if (language === 'java') {
        generatedCode = `// ${prompt}
// Generated by AI Code Generator

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ${prompt.charAt(0).toUpperCase() + prompt.slice(1)} - A Java solution
 * This code demonstrates best practices and modern Java features
 */
public class ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager {
    
    // Configuration constants
    private static final String VERSION = "1.0.0";
    private static final String LANGUAGE = "Java";
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    // Instance variables
    private boolean isInitialized;
    private final Map<String, Object> dataCache;
    private final ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config config;
    
    /**
     * Configuration class for ${prompt} system
     */
    public static class ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config {
        private final boolean debugMode;
        private final int maxRetries;
        private final double timeout;
        private final String dataPath;
        
        private ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config(Builder builder) {
            this.debugMode = builder.debugMode;
            this.maxRetries = builder.maxRetries;
            this.timeout = builder.timeout;
            this.dataPath = builder.dataPath;
        }
        
        // Builder pattern for configuration
        public static class Builder {
            private boolean debugMode = false;
            private int maxRetries = 3;
            private double timeout = 30.0;
            private String dataPath = "data/${prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}";
            
            public Builder debugMode(boolean debugMode) {
                this.debugMode = debugMode;
                return this;
            }
            
            public Builder maxRetries(int maxRetries) {
                this.maxRetries = maxRetries;
                return this;
            }
            
            public Builder timeout(double timeout) {
                this.timeout = timeout;
                return this;
            }
            
            public Builder dataPath(String dataPath) {
                this.dataPath = dataPath;
                return this;
            }
            
            public ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config build() {
                return new ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config(this);
            }
        }
    }
    
    /**
     * Constructor with default configuration
     */
    public ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager() {
        this(new ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config.Builder().build());
    }
    
    /**
     * Constructor with custom configuration
     */
    public ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager(${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Config config) {
        this.config = config;
        this.isInitialized = false;
        this.dataCache = new HashMap<>();
    }
    
    /**
     * Initialize the ${prompt} system
     * @return true if initialization successful, false otherwise
     */
    public boolean initialize() {
        try {
            // Initialize system components
            this.isInitialized = true;
            System.out.println("${prompt} system initialized successfully");
            return true;
            
        } catch (Exception e) {
            System.err.println("Failed to initialize ${prompt} system: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Process ${prompt} data
     * @param input Input data to process
     * @return ProcessingResult containing processed data and metadata
     * @throws IllegalStateException if system not initialized
     */
    public ProcessingResult process(Object input) {
        if (!isInitialized) {
            throw new IllegalStateException("${prompt} system not initialized");
        }
        
        // Process the input based on ${prompt} requirements
        Object processedData = validateAndProcess(input);
        
        return new ProcessingResult(input, processedData);
    }
    
    /**
     * Validate and process input data
     * @param input Input to validate
     * @return Processed data
     */
    private Object validateAndProcess(Object input) {
        if (input == null) {
            throw new IllegalArgumentException("Input cannot be null");
        }
        
        // Custom processing logic for ${prompt}
        if (input instanceof String) {
            return ((String) input).trim().toLowerCase();
        } else if (input instanceof Collection) {
            return ((Collection<?>) input).stream()
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } else if (input instanceof Map) {
            return ((Map<?, ?>) input).entrySet().stream()
                    .filter(entry -> entry.getValue() != null)
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (existing, replacement) -> existing,
                            HashMap::new
                    ));
        }
        
        return input;
    }
    
    /**
     * Result class for processing operations
     */
    public static class ProcessingResult {
        private final Object original;
        private final Object processed;
        private final String timestamp;
        private final Map<String, Object> metadata;
        
        public ProcessingResult(Object original, Object processed) {
            this.original = original;
            this.processed = processed;
            this.timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
            this.metadata = createMetadata();
        }
        
        private Map<String, Object> createMetadata() {
            Map<String, Object> meta = new HashMap<>();
            meta.put("prompt", "${prompt}");
            meta.put("language", LANGUAGE);
            meta.put("version", VERSION);
            return meta;
        }
        
        // Getters
        public Object getOriginal() { return original; }
        public Object getProcessed() { return processed; }
        public String getTimestamp() { return timestamp; }
        public Map<String, Object> getMetadata() { return metadata; }
        
        @Override
        public String toString() {
            return String.format("ProcessingResult{original=%s, processed=%s, timestamp='%s'}", 
                    original, processed, timestamp);
        }
    }
    
    /**
     * Main method to demonstrate usage
     */
    public static void main(String[] args) {
        ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager manager = new ${prompt.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() + prompt.replace(/[^a-zA-Z0-9]/g, '').slice(1)}Manager();
        
        // Initialize and use
        if (manager.initialize()) {
            try {
                ProcessingResult result = manager.process("Sample data for ${prompt}");
                System.out.println("Processing result: " + result);
            } catch (Exception e) {
                System.err.println("Error during processing: " + e.getMessage());
            }
        }
    }
}`;
    }
}

// Display generated text
function displayGeneratedText(text, prompt, type) {
    const placeholder = document.querySelector('.placeholder-text');
    const generatedTextDiv = document.getElementById('generatedText');
    
    // Hide placeholder with animation
    placeholder.style.opacity = '0';
    placeholder.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        placeholder.style.display = 'none';
        generatedTextDiv.style.display = 'block';
        
        // Set text content
        document.getElementById('textContent').innerHTML = text.replace(/\\n/g, '<br>');
        
        // Show text with animation
        generatedTextDiv.style.opacity = '0';
        generatedTextDiv.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            generatedTextDiv.style.transition = 'all 0.5s ease-out';
            generatedTextDiv.style.opacity = '1';
            generatedTextDiv.style.transform = 'scale(1)';
        }, 100);
        
        // Animate action buttons
        const actionButtons = document.querySelectorAll('.text-actions .action-btn');
        actionButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(20px)';
                btn.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    btn.style.opacity = '1';
                    btn.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
        
    }, 300);
}



// Handle download
function handleDownload() {
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = 'generated-image.jpg';
    link.click();
    
    showNotification('Image downloaded successfully!', 'success');
}

// Handle text copy
function handleTextCopy() {
    const textContent = document.getElementById('textContent').textContent;
    navigator.clipboard.writeText(textContent).then(() => {
        showNotification('Text copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy text', 'error');
    });
}







// Handle share
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Image',
            text: 'Check out this amazing AI-generated image!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
    }
}

// Handle gallery item click
function handleGalleryItemClick(event) {
    const item = event.currentTarget;
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    // Create modal for full-size view
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="modal-close">&times;</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Close modal on click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const scrollElements = document.querySelectorAll('.gallery-item, .footer-section');
    scrollElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// Setup parallax effects
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#4ecdc4' : '#45b7d1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

// Add gallery modal styles
const modalStyles = `
    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }
    
    .modal-overlay {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .modal-content {
        position: relative;
    }
    
    .modal-content img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter to generate image
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (!isGenerating) {
            handleGenerateClick();
        }
    }
    
    // Escape to close modals
    if (event.key === 'Escape') {
        const modal = document.querySelector('.gallery-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        }
        
        hideLoadingModal();
    }
});

// Add mouse trail effect
let mouseTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (event) => {
    mouseTrail.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now()
    });
    
    // Keep only recent positions
    if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
    }
    
    // Create trail effect
    if (mouseTrail.length > 5) {
        createTrailEffect(event.clientX, event.clientY);
    }
});

function createTrailEffect(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(trail);
    
    // Animate and remove
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'translate(-50%, -50%) scale(2)';
        setTimeout(() => {
            if (document.body.contains(trail)) {
                document.body.removeChild(trail);
            }
        }, 300);
    }, 100);
}

// Performance optimization: Throttle mouse events
let mouseTimeout;
document.addEventListener('mousemove', () => {
    if (mouseTimeout) return;
    
    mouseTimeout = setTimeout(() => {
        mouseTimeout = null;
    }, 16); // ~60fps
});

console.log('🚀 AI Content Creator loaded with mind-blowing animations!'); 