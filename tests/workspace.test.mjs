import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exampleDestination, nextStage, pickComparisonVersion, screenshotError } from '../lib/workspace-rules.ts';

test('only the known example route is accepted after sign-in', () => {
  assert.equal(exampleDestination('example'), '/projects/example');
  assert.equal(exampleDestination(undefined), '/projects');
  assert.equal(exampleDestination('https://example.com'), '/projects');
  assert.equal(exampleDestination(['example']), '/projects');
});

test('Make progresses directly to Revise without a comparison', () => {
  assert.equal(nextStage('make'), 'revise');
  assert.equal(nextStage('reflect'), null);
});

test('the comparison cannot reuse the version already on the other side', () => {
  assert.equal(pickComparisonVersion(2, 2), null);
  assert.equal(pickComparisonVersion(2, 3), 3);
});

test('screenshots match the storage bucket constraints', () => {
  assert.equal(screenshotError({ type: 'image/png', size: 5 * 1024 * 1024 }), null);
  assert.match(screenshotError({ type: 'image/png', size: 5 * 1024 * 1024 + 1 }), /5 MB/);
  assert.match(screenshotError({ type: 'application/pdf', size: 100 }), /PNG or JPG/);
  assert.match(screenshotError({ type: 'image/jpeg', size: 0 }), /empty/);
});
