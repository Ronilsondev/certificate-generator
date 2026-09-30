const { test } = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
require('../dist/assets/data-validation.js');
const { parseCsv, parseTxt, validateRecords, inspect } = window.CertificateData;

test('CSV recognizes separators, accents, BOM, quoted separators and escaped quotes', () => {
  for (const separator of [',', ';', '\t']) {
    assert.deepEqual(parseCsv(`\uFEFFname${separator}curso\r\n"João${separator} Silva"${separator}"Curso ""A"""\r\n`),
      [{ name: `João${separator} Silva`, curso: 'Curso "A"' }]);
  }
  assert.deepEqual(parseCsv('name,curso\n"Ana\nSilva",Web'), [{ name: 'Ana\nSilva', curso: 'Web' }]);
  assert.deepEqual(parseTxt('\uFEFFJoão\r\n\r\nAna\rJosé'), [{ name: 'João' }, { name: 'Ana' }, { name: 'José' }]);
});
test('CSV refuses malformed data instead of silently discarding it', () => {
  for (const [input, message] of [
    ['name,Name\nAna,Bia', /repetido/], ['name,\nAna,Web', /vazio/],
    ['name,curso\nAna', /Linha 2/], ['name\nAna,Web', /colunas/],
    ['name\n"Ana', /não fechadas/], ['name\n"Ana"x', /fechamento/],
    ['name\nAn"a', /posição/], ['name', /pelo menos/], ['{{name}}\nAna', /chaves/]
  ]) assert.throws(() => parseCsv(input), message);
  assert.throws(() => parseTxt('  \n '), /nome/);
});
test('preflight checks referenced values, own properties and template syntax', () => {
  assert.deepEqual(inspect([{ name: 'Ana', unused: '' }], [{ text: '{{ name }}' }]), []);
  assert.equal(inspect([{ name: '' }, { name: 'Ana' }], [{ text: '{{name}} {{curso}}' }]).length, 2);
  assert.equal(inspect([{}], [{ text: '{{toString}}' }])[0].count, 1);
  assert.match(inspect([{ name: '' }], [{ text: '{{name}}' }], 3)[0].message, /: 4\./);
  assert.match(inspect([{}], [{ text: '{{}}' }])[0].message, /malformada/);
  assert.deepEqual(inspect([{ hours: 0 }], [{ text: '{{hours}}' }]), []);
});
test('project and automation records must contain scalar data', () => {
  for (const input of [[], [{}], [null], [{ name: {} }], [{ name: NaN }], [{ ' ': 'Ana' }]])
    assert.throws(() => validateRecords(input));
  validateRecords([{ name: 'Ana', hours: 10 }]);
});
