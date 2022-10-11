const { awscdk } = require('projen');

const cdkVersion = '2.31.0'

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Kevin Lucas',
  authorAddress: 'kevinluc08@gmail.com',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'master',
  name: 'cdk-extensions',
  repositoryUrl: 'https://github.com/Pharrox/cdk-extensions.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();