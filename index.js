import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import colors from 'colors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// * Configure API
const configuration = new Configuration({
	organization: process.env.API_ORG_ID,
	apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`.brightCyan.underline.italic);
});

app.get('/', (req, res) => {
	res.send('Hello from the backend');
});

app.post('/', async (req, res) => {
	const { message } = req.body;
	try {
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: `${message}`,
			max_tokens: 100,
			temperature: 0.5,
		});
		res.json({
			message: response.data.choices[0].text,
		});
	} catch (error) {
		console.log(error);
		res.send(error).status(400);
	}
});
