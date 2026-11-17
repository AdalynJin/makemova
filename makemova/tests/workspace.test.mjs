import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exampleDestination } from '../lib/workspace-rules.ts';

test('only the known example route is accepted after sign-in', () => {
  assert.equal(exampleDestination('example'), '/projects/example');
  assert.equal(exampleDestination(undefined), '/projects');
  assert.equal(exampleDestination('https://example.com'), '/projects');
  assert.equal(exampleDestination(['example']), '/projects');
});
