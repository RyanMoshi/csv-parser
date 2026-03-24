'use strict';
// Parse and transform CSV strings with configurable delimiter and header mapping

function parseLine(line, delimiter) {
  delimiter = delimiter || ',';
  const fields = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      fields.push(field.trim());
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field.trim());
  return fields;
}

function parse(csv, options) {
  options = options || {};
  const delimiter = options.delimiter || ',';
  const hasHeader = options.header !== false;
  const lines = csv.split(/?
/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = hasHeader ? parseLine(lines[0], delimiter) : null;
  const dataLines = hasHeader ? lines.slice(1) : lines;
  return dataLines.map((line) => {
    const values = parseLine(line, delimiter);
    if (headers) {
      const row = {};
      headers.forEach((h, i) => { row[h] = values[i] !== undefined ? values[i] : ''; });
      return row;
    }
    return values;
  });
}

function stringify(rows, options) {
  options = options || {};
  const delimiter = options.delimiter || ',';
  if (!rows.length) return '';
  const headers = options.headers || Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v === null || v === undefined ? '' : v);
    return s.includes(delimiter) || s.includes('"') || s.includes('
')
      ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.map(escape).join(delimiter)];
  rows.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(delimiter)));
  return lines.join('
');
}

module.exports = { parse, stringify, parseLine };
