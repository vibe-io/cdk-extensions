import { AlertManagerMatcher, MatchOperator } from '..';


test('component matchers should properly build expressions', () => {
  const eqMatcher = AlertManagerMatcher.fromComponents('label', MatchOperator.EQUALS, 'active');
  const neMatcher = AlertManagerMatcher.fromComponents('label', MatchOperator.NOT_EQUALS, 'active');
  const reEqMatcher = AlertManagerMatcher.fromComponents('label', MatchOperator.RE_EQUALS, 'active');
  const reNeMatcher = AlertManagerMatcher.fromComponents('label', MatchOperator.RE_NOT_EQUALS, 'active');

  expect(eqMatcher.expression).toBe('label = "active"');
  expect(neMatcher.expression).toBe('label != "active"');
  expect(reEqMatcher.expression).toBe('label =~ "active"');
  expect(reNeMatcher.expression).toBe('label !~ "active"');
});

test('compound matchers should properly build expressions', () => {
  const compound = AlertManagerMatcher.fromCompound(
    AlertManagerMatcher.fromComponents('eq', MatchOperator.EQUALS, 'active'),
    AlertManagerMatcher.fromComponents('ne', MatchOperator.NOT_EQUALS, 'active'),
    AlertManagerMatcher.fromComponents('reEq', MatchOperator.RE_EQUALS, 'active'),
    AlertManagerMatcher.fromComponents('reNe', MatchOperator.RE_NOT_EQUALS, 'active'),
  );

  expect(compound.expression).toBe('{eq = "active", ne != "active", reEq =~ "active", reNe !~ "active"}');
});

test('creating a compound matcher with no components should fail', () => {
  expect(() => {
    AlertManagerMatcher.fromCompound();
  }).toThrowError([
    'Must specify at least one sub-matcher when creating a compound',
    'matcher statement.',
  ].join(' '));
});

test('creating a compound matcher with a single component will give a simple expression', () => {
  const inner = AlertManagerMatcher.fromString('label = "active"');
  const compound = AlertManagerMatcher.fromCompound(inner);
  expect(compound.expression).toBe('label = "active"');
});

test('expression matchers should always render literally', () => {
  const matcher = AlertManagerMatcher.fromString('probably not a valid expression');

  expect(matcher.expression).toBe('probably not a valid expression');
});

test('special characters should be escaped in compound expressions', () => {
  const matcher = AlertManagerMatcher.fromComponents('label', MatchOperator.EQUALS, 'a "string" with a \\ and\nnewline');

  expect(matcher.expression).toBe('label = "a \\"string\\" with a \\\\ and\\nnewline"');
});
