#!/usr/bin/env node

const https = require('https');
const Communication = require('./ai/interface');
const config = require('./config/config.json');

const apiKey = config.gpt.api_key;
const baseUrl = config.gpt.api_endpoint;
const AI = new Communication(apiKey, baseUrl);

async function getResponse(prompt) {
  try {
    const response = await AI.converse(prompt);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}

getResponse('Just say "OK".');
