import assert from 'node:assert/strict';
import test from 'node:test';
import {demoScenarios, findDemoScenario, toDemoAnswer} from '../lib/trustpm/demo-data.ts';

test('ships exactly three stable hackathon scenarios', () => {
  assert.equal(demoScenarios.length, 3);
  assert.deepEqual(demoScenarios.map((item) => item.scenarioId), [
    'fee-collection',
    'budget-variance',
    'public-revenue',
  ]);
});

test('matches each demo question to the expected controlled evidence pack', () => {
  for (const scenario of demoScenarios) {
    assert.equal(findDemoScenario(scenario.question).scenarioId, scenario.scenarioId);
  }
});

test('labels prototype sources and exposes a stable fallback disclosure', () => {
  for (const scenario of demoScenarios) {
    const answer = toDemoAnswer(scenario);
    assert.equal(answer.mode, 'demo');
    assert.match(answer.disclosure, /Controlled Demo Mode/);
    assert.ok(answer.sources.some((source) => source.demoOnly));
    assert.ok(answer.sources.some((source) => source.type === 'JD' && source.href?.startsWith('/knowledge/jd')));
  }
});
