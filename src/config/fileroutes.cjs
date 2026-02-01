const { resolve } = require('node:path');
const express = require('express');

const uploadpath = resolve(__dirname, '..', '..', 'uploads');

const fileRoutesConfig = express.static(uploadpath);

module.exports = fileRoutesConfig;