const axios = require('axios');
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path')
const { saveFile } = require('./files.js');
const { program } = require('commander');

program
    .option('-d, --directory <type>', 'Directory', './data/html')
    .option('-n, --name <type>', 'File name (required)')
    .option('-e, --extension <type>', 'File extension', '.html')
    .option('-s, --source-document-id <type>', 'Source Document ID (required)')
    .parse(process.argv);

const options = program.opts();
if (!options.name || !options.sourceDocumentId) {
  console.log('--name and --source-document-id are required');
  process.exit(1);
}
const fileName = options.name + options.extension
const directory = options.directory.endsWith('/') ? options.directory : options.directory + '/';  
let html = '';

const url = `http://pravo.gov.ru/proxy/ips/?doc_itself=&nd=${options.sourceDocumentId}&fulltext=1`;

axios({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer'
})
  .then(function (response) {
    html = iconv.decode(Buffer.from(response.data), 'win1251');
    saveFile(directory + fileName , html);
  })
  .catch(function (error) {
    console.error("Ошибка при загрузке страницы:", error);
  });