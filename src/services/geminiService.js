import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.apiKey = apiKey;
  }

  async analyzeImage(imageData) {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized. Please provide an API key.');
    }

    try {
      
      const visionModel = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash'
      });

      
      const imageParts = [
        {
          inlineData: {
            data: imageData.split(',')[1], 
            mimeType: 'image/jpeg',
          },
        },
      ];

      const prompt = `You are WhisperLens, a friendly AI narrator that helps people understand the world around them. 
      
Analyze this image and provide a response in the following format:

**Object Name:** [Clear, simple name of the main object]

**What It Is:** [Brief, engaging description of what this object is - 2-3 sentences]

**How It's Used:** [Practical information about how people use this object - 2-3 sentences]

**Fun Fact:** [An interesting, educational, or surprising fact about this object - 1-2 sentences]

Make your response:
- Educational yet conversational
- Suitable for all ages (especially kids and curious learners)
- Culturally aware and respectful
- Focused on the most prominent object in the image
- Engaging and memorable

If you see multiple objects, focus on the most prominent or interesting one.`;

      const result = await visionModel.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  parseResponse(text) {
    
    const sections = {
      name: '',
      description: '',
      usage: '',
      funFact: '',
      fullText: text,
    };

    
    const nameMatch = text.match(/\*\*Object Name:\*\*\s*(.+?)(?=\n|$)/i);
    const descMatch = text.match(/\*\*What It Is:\*\*\s*(.+?)(?=\*\*|$)/is);
    const usageMatch = text.match(/\*\*How It's Used:\*\*\s*(.+?)(?=\*\*|$)/is);
    const factMatch = text.match(/\*\*Fun Fact:\*\*\s*(.+?)(?=\*\*|$)/is);

    if (nameMatch) sections.name = nameMatch[1].trim();
    if (descMatch) sections.description = descMatch[1].trim();
    if (usageMatch) sections.usage = usageMatch[1].trim();
    if (factMatch) sections.funFact = factMatch[1].trim();

    return sections;
  }
}

export default new GeminiService();
