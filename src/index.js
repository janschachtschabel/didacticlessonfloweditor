import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { OpenAI } from 'openai';
import { z } from 'zod';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from public directory
app.use(express.static(join(__dirname, '../public')));

// Schema definitions
const BaseItemSchema = z.object({
    description: z.string().min(1)
});

const SolutionSchema = z.object({
    solution_description: z.string().min(1),
    didactic_approach: z.string().min(1),
    didactic_template: z.record(z.any()),
    consequences: z.record(z.any()),
    implementation_notes: z.array(z.any()),
    related_patterns: z.array(z.any()),
    sources: z.array(z.any())
});

const TemplateSchema = z.object({
    metadata: z.record(z.any()),
    problem: z.record(z.any()),
    context: z.record(z.any()),
    influence_factors: z.array(z.any()),
    solution: SolutionSchema,
    consequences: z.record(z.any()),
    implementation_notes: z.array(z.any()),
    related_patterns: z.array(z.any()),
    feedback: z.record(z.any()),
    sources: z.array(z.any())
});

// API Routes
app.post('/api/process-template', async (req, res) => {
    try {
        const { template, userInput, apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'OpenAI API key is required' });
        }

        const client = new OpenAI({ apiKey });
        
        const prompt = `
Please help complete or modify this template based on the user's instructions.

Current template:
${JSON.stringify(template, null, 2)}

User instructions:
${userInput}

Please return the modified template as a valid JSON object.
`;

        const completion = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that modifies templates." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        
        // Validate the result against our schema
        TemplateSchema.parse(result);

        res.json(result);
    } catch (error) {
        console.error('Template processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});