#!/usr/bin/env node

const https = require('https');
const system = require('../config/system.json');

class Communication {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.systemPrompts = system.prompts;
  }

  async sendRequest(method, endpoint, data = null) {

    // debug
    console.log(data)

    const startTime = performance.now(); // Record start time

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

      // debug
      console.log(options)

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {

          const endTime = performance.now(); // Record end time
          const responseTime = endTime - startTime; // Calculate response time

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
  // standard conversation
  async converse(prompt, model = 'gpt-3.5-turbo', maxTokens = 150) {
    const systemPrompts = this.systemPrompts.map(prompt => ({ role: 'system', content: prompt }));
    const userPrompt = { role: 'user', content: prompt };

    const response = await this.sendRequest('post', 'chat/completions', {
      model,
      messages: [...systemPrompts, userPrompt],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content;
  }

}

module.exports = Communication;
