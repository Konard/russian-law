const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path')
const { saveFile } = require('./files.js');

// Преобразование HTML к JSON
function htmlToJson(html) {
  const result = { preamble: [], sections: [] };
  const dom = new JSDOM(html);
  const paragraphs = [...dom.window.document.querySelectorAll("p")];

  let preambleMode = true;
  let currentSection;
  let currentChapter;
  let currentArticle;

  for(const p of paragraphs) {
      // Если параграф пустой, пропускаем
      if(!p.textContent.trim()) continue;

      if(p.classList.contains("T") || p.classList.contains("C")) {
          preambleMode = false; // Конец преамбулы
          
          const text = p.textContent.trim();

          if(text.startsWith("РАЗДЕЛ")) {
              currentSection = { title: text, chapters: [] }; // Новый раздел
              currentChapter = null; // Нет текущей главы пока не встретим новую
              result.sections.push(currentSection);
          } else if(text.startsWith("ГЛАВА") && currentSection) {
              currentChapter = { title: text, articles: [] }; // Новая глава
              currentArticle = null;
              currentSection.chapters.push(currentChapter);
          } else if(text.startsWith("Статья") && currentChapter) {
              currentArticle = { title: text, clauses: [] }; // Новая статья
              currentChapter.articles.push(currentArticle);
          }
      } else if(preambleMode) {
          result.preamble.push(p.textContent.trim());
      } else if(currentArticle) {
          currentArticle.clauses.push(p.textContent.trim());
      }
  }

  return result;
}

const html = fs.readFileSync('./data/html/constitution.html', 'utf8');

const json = htmlToJson(html);
// console.log('json', json);
// console.log('json.sections[0].chapters', json.sections[0].chapters);

saveFile('./data/json/constitution.json', JSON.stringify(json, null, 2));