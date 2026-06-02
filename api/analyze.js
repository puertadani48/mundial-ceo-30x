export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { system, messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic error:', JSON.stringify(data.error));
      return res.status(400).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ error: 'Failed to get AI response' });
  }
}