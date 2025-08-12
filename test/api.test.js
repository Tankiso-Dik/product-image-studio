const test = require('node:test');
const assert = require('assert');
const request = require('supertest');
const { PNG } = require('pngjs');
const app = require('../server');

function binaryParser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', (chunk) => { res.data += chunk; });
  res.on('end', () => {
    callback(null, Buffer.from(res.data, 'binary'));
  });
}

test('GET /api/scenes returns list', async () => {
  const res = await request(app).get('/api/scenes').expect(200);
  assert.ok(Array.isArray(res.body.scenes));
  assert.ok(res.body.scenes.includes('01-thumbnail'));
});

test('GET /api/compose rejects traversal', async () => {
  await request(app)
    .get('/api/compose?scene=../package.json')
    .expect(400);
});

test('POST /api/compose renders HTML', async () => {
  const res = await request(app)
    .post('/api/compose')
    .send({ scene: '01-thumbnail', mainHeading: 'Hello' })
    .expect(200)
    .expect('Content-Type', /html/);
  assert.ok(/Hello/.test(res.text));
});

test('POST /api/compose rejects traversal', async () => {
  await request(app)
    .post('/api/compose')
    .send({ scene: '../etc/passwd' })
    .expect(400);
});

test('POST /api/screenshot returns PNG with size', async () => {
  const res = await request(app)
    .post('/api/screenshot')
    .buffer(true)
    .parse(binaryParser)
    .send({ scene: '01-thumbnail', width: 200, height: 100 })
    .expect(200)
    .expect('Content-Type', /png/);
  const png = PNG.sync.read(res.body);
  assert.strictEqual(png.width, 200);
  assert.strictEqual(png.height, 100);
});

test('POST /api/screenshot rejects traversal', async () => {
  await request(app)
    .post('/api/screenshot')
    .send({ scene: '../etc/passwd' })
    .expect(400);
});
