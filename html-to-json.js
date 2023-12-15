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

    let currentSection = null;
    let currentChapter = null;
    let currentArticle = null;
    let preambleMode = true;

    for (const p of paragraphs) {
        const text = p.textContent.trim();
        if (!text) continue;

        if (preambleMode && !p.classList.contains("H") && !p.classList.contains("T")) {
            result.preamble.push(text);
            continue;
        }

        if (p.classList.contains("H") || p.classList.contains("T")) {
            preambleMode = false;

            if (text.startsWith("РАЗДЕЛ") || text.startsWith("Раздел")) {
                currentSection = { title: text, chapters: [] };
                result.sections.push(currentSection);
                currentChapter = null;
                currentArticle = null;
            } else if (text.startsWith("ГЛАВА") || text.startsWith("Глава")) {
                currentChapter = { title: text, articles: [] };
                if (currentSection) {
                    currentSection.chapters.push(currentChapter);
                } else {
                    currentSection = { title: "", chapters: [currentChapter] };
                    result.sections.push(currentSection);
                }
                currentArticle = null;
            } else if (text.startsWith("Статья")) {
                currentArticle = { title: text, clauses: [] };
                if (currentChapter) {
                    currentChapter.articles.push(currentArticle);
                } else {
                    currentChapter = { title: "", articles: [currentArticle] };
                    if (currentSection) {
                        currentSection.chapters.push(currentChapter);
                    } else {
                        currentSection = { title: "", chapters: [currentChapter] };
                        result.sections.push(currentSection);
                    }
                }
            }
        } else if (currentArticle) {
            currentArticle.clauses.push(text);
        } else if (currentChapter) {
            currentChapter.articles.push({ title: "", clauses: [text] });
        } else if (currentSection) {
            currentSection.chapters.push({ title: "", articles: [{ title: "", clauses: [text] }] });
        } else {
            result.preamble.push(text);
        }
    }

    return result;
}

// const documentId = 102027595;
const documentId = 102041891;

const html = fs.readFileSync(`./data/html/${documentId}.html`, 'utf8');

const json = htmlToJson(html);
// console.log('json', json);
// console.log('json.sections[0].chapters', json.sections[0].chapters);

saveFile(`./data/json/${documentId}.json`, JSON.stringify(json, null, 2));