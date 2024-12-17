#!/usr/bin/env node

const https = require('https');
const Communication = require('./ai/interface');
const config = require('./config/config.json');

const debug = config.settings.debug;

const apiKey = config.gpt.api_key;
const baseUrl = config.gpt.api_endpoint;
const AICommunication = new Communication(apiKey, baseUrl);

async function talk(prompt) {
  try {
    const response = await AICommunication.converse(prompt);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}

talk('Require system status.');
