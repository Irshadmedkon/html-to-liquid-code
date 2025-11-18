
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function callGemini(prompt: string, errorMessage: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        if (response.text) {
            return response.text.trim();
        } else {
            throw new Error('Received an empty response from the API.');
        }
    } catch (error) {
        console.error(`Error in callGemini for "${errorMessage}":`, error);
        throw new Error(`${errorMessage}. Please check the API connection and your input.`);
    }
}

export async function convertToLiquid(html: string, css: string, js: string): Promise<string> {
  const prompt = `
You are an expert Shopify Liquid developer. Your task is to convert the provided HTML, CSS, and JavaScript into a single, complete Shopify Liquid file.

Instructions:
1. Convert the HTML structure into valid Liquid syntax where appropriate (e.g., using Liquid objects, tags, and filters).
2. Embed the entire provided CSS code within a <style> tag.
3. Embed the entire provided JavaScript code within a <script> tag.
4. Combine everything into a single, valid .liquid file structure.
5. The final output must be ONLY the raw code for the .liquid file. Do not include any explanations, comments about the conversion, or markdown formatting like \`\`\`liquid.

Here is the code to convert:

HTML:
\`\`\`html
${html}
\`\`\`

CSS:
\`\`\`css
${css}
\`\`\`

JavaScript:
\`\`\`javascript
${js}
\`\`\`

Liquid File Code:`;

  return callGemini(prompt, "Failed to generate Liquid file");
}

export async function explainLiquidCode(liquidCode: string): Promise<string> {
    const prompt = `
You are a Shopify Liquid expert. Explain the following Liquid code clearly and concisely. 
Describe its structure, any dynamic elements (like Liquid objects or variables), and how it would function in a Shopify theme.
The explanation should be easy for another developer to understand.
Output ONLY the plain text explanation, without any markdown formatting, titles, or conversational filler.

Liquid Code:
\`\`\`liquid
${liquidCode}
\`\`\`

Explanation:`;
    return callGemini(prompt, "Failed to generate explanation");
}

export async function generateLiquidSchema(liquidCode: string): Promise<string> {
    const prompt = `
You are an expert Shopify theme developer. Based on the provided Liquid code, generate a corresponding Shopify section schema.
The schema should include appropriate settings for any customizable elements found in the code (e.g., text, images, colors).
Output ONLY the raw JSON for the schema object. Do not include the surrounding "{% schema %}" tags or any markdown formatting like \`\`\`json.

Liquid Code:
\`\`\`liquid
${liquidCode}
\`\`\`

JSON Schema:`;
    return callGemini(prompt, "Failed to generate schema");
}
