const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path')
const { saveFile } = require('./files.js');

function jsonToArticles(law) {
    const result = [];
    // console.log(law.sections.length);
    for (const section of law.sections) {
      for (const chapter of section.chapters) {
        for (const article of chapter.articles) {
          const articleText = `${article.title}\n${article.clauses.join("\n")}`;
          console.log(articleText);
          result.push(articleText);
        }
      }
    }
    return result;
}

// const documentId = 102027595;
const documentId = 434767;

const law = JSON.parse(fs.readFileSync(`./data/json/${documentId}.json`, 'utf8'));

const json = jsonToArticles(law);
// console.log('json', json);
// console.log('json.sections[0].chapters', json.sections[0].chapters);

saveFile(`./data/json/${documentId}.articles.json`, JSON.stringify(json, null, 2));