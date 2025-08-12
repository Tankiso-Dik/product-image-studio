const test = require('node:test');
const assert = require('assert');
const request = require('supertest');
const app = require('../server');

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

