'use strict';

function unescape(input) {
  return String(input)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");//validator.jsリポジトリのマネ
}

module.exports = unescape;