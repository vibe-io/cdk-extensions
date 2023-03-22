import { readFileSync } from 'fs';
import { AlertManagerTemplate } from '..';


test('templates loaded from file should match the content of the file', () => {
  const pathTemplate = './src/aps/test/configs/alert-manager-template.tmpl';

  const contentsTemplate = readFileSync(pathTemplate, {
    encoding: 'utf8',
    flag: 'r',
  });

  const template = AlertManagerTemplate.fromFile(pathTemplate);

  expect(template.content).toBe(contentsTemplate);
});

test('templates loaded from string should be an exact copy of that string', () => {
  const template = AlertManagerTemplate.fromString('test-template');

  expect(template.content).toBe('test-template');
});