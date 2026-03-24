'use strict';
const { parse, stringify } = require('../src/index');

// Parse CSV from string
const csv = `name,age,city
Alice,30,New York
Bob,25,"San Francisco, CA"
Carol,35,Chicago`;

const rows = parse(csv);
console.log('Parsed rows:');
console.log(rows);

// Access individual fields
rows.forEach((row) => {
  console.log(row.name + ' is ' + row.age + ' years old, lives in ' + row.city);
});

// Stringify back to CSV
const output = stringify(rows);
console.log('\nStringified:');
console.log(output);

// Custom delimiter (TSV)
const tsv = 'a\tb\tc\n1\t2\t3';
const tsvRows = parse(tsv, { delimiter: '\t' });
console.log('\nTSV rows:', tsvRows);
