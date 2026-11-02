import { createFetcher, HttpError, TimeoutError } from '@avkashhhh/smart-fetch';

const hfFetcher = createFetcher({
  baseURL: 'https://router.huggingface.co/v1',
  timeout: 15000,
  retries: 2,
});

export { HttpError, TimeoutError };

export async function queryHF(data) {
  try {
    const result = await hfFetcher.getJSON('/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    console.error('Error querying LLM:', error);
    throw error;
  }
}
