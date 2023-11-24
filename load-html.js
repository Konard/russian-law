const axios = require('axios');
const iconv = require('iconv-lite');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path')
const { saveFile } = require('./files.js');
const url = "http://pravo.gov.ru/proxy/ips/?doc_itself=&nd=102027595&page=1&rdk=20&link_id=0#I0";
let html = '';

axios({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer'  // указываем, что ответ должен быть в виде ArrayBuffer
})
  .then(function (response) {
    html = iconv.decode(Buffer.from(response.data), 'win1251'); // декодируем данные с win-1251 в utf-8
    saveFile('./data/html/constitution.html', html);
    // console.log(html);
  })
  .catch(function (error) {
    console.error("Ошибка при загрузке страницы:", error);
  });