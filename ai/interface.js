const https = require('https');

class Communication {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async sendRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        hostname: this.baseUrl,
        path: `/v1/${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      };
      console.log(options)
  
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(body));
          } else {
            reject(new Error(`Error sending request to OpenAI API: ${body}`));
          }
        });
      });
  
      req.on('error', (error) => {
        reject(new Error(`Error sending request to OpenAI API: ${error.message}`));
      });
  
      if (data) {
        req.write(JSON.stringify(data));
      }
  
      req.end();
    });
  }
  
  async converse(prompt, model = 'gpt-3.5-turbo', maxTokens = 150) {
    const response = await this.sendRequest('post', 'chat/completions', {
      model,
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content;
  }
}

module.exports = Communication;
