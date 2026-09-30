const { test } = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
require('../dist/assets/history.js');
function editor(limit) {
  const state = { fields: [{ id: 'name', text: 'Original', x: 10 }], images: [], photos: [], shapes: [],
    records: [{ name: 'Ana' }], customFonts: [], layerOrder: ['name'], selectedIds: ['name'], selectedField: 'name', currentRecord: 0 };
  const design = { width: 1200, height: 848 };
  const buttons = {};
  let changes = 0;
  const history = window.CertificateHistory.create({ state, design, limit, restore() {},
    onChange() { changes++; }, onButtons(undo, redo) { Object.assign(buttons, { undo, redo }); } });
  return { state, design, history, buttons, changes: () => changes };
}
test('history groups typing and dragging, supports branching, and ignores selection', () => {
  const { state, history, buttons } = editor();
  history.setGroup('typing');
  state.fields[0].text = 'O'; history.capture();
  state.fields[0].text = 'Outro'; history.capture();
  history.undo(); assert.equal(state.fields[0].text, 'Original');
  history.redo(); assert.equal(state.fields[0].text, 'Outro');
  state.selectedIds = []; history.capture();
  history.undo(); assert.equal(state.fields[0].text, 'Original');
  state.interaction = {};
  state.fields[0].x = 20; history.capture();
  state.fields[0].x = 30; history.capture();
  state.interaction = null; history.capture();
  assert.equal(buttons.redo, false);
  history.undo(); assert.equal(state.fields[0].x, 10);
});
test('history restores assets, crops, datasets and dimensions without cloning decoded assets', () => {
  const { state, design, history } = editor();
  const bitmap = {};
  state.images = [{ id: 'logo', image: bitmap, sourceImage: bitmap, src: 'first', crop: { x: 0, y: 0, width: 10, height: 10 } }];
  state.records = [{ image: 'image.png', data: '10/10', selectedField: 'anything' }];
  history.capture();
  state.images[0].crop.width = 5; state.images[0].image = {};
  design.width = 600; history.capture();
  history.undo();
  assert.equal(state.images[0].image, bitmap);
  assert.equal(state.images[0].crop.width, 10);
  assert.equal(design.width, 1200);
  history.undo(); assert.equal(state.images.length, 0);
  assert.deepEqual(state.records, [{ name: 'Ana' }]);
});
test('history bounds retained steps and recognizes changes in columns with reserved names', () => {
  const { state, history, buttons } = editor(2);
  for (let n = 1; n <= 4; n++) {
    state.records = [{ data: n, src: 'file', image: 'a.png' }]; history.capture();
  }
  history.undo(); assert.equal(state.records[0].data, 3);
  history.undo(); assert.equal(state.records[0].data, 2);
  assert.equal(buttons.undo, false);
  history.undo(); assert.equal(state.records[0].data, 2);
});
