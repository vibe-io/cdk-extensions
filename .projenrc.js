const { awscdk, LogLevel } = require('projen');

const projectName = 'cdk-extensions';
const cdkVersion = '2.45.0';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Kevin Lucas',
  authorAddress: 'kevinluc08@gmail.com',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'master',
  gitignore: [
    '/docs/generated/',
    '/.vscode/',
  ],
  logging: {
    level: LogLevel.VERBOSE
  },
  publishToNuget: {
    dotNetNamespace: 'CdkExtensions',
    packageId: 'CdkExtensions',
  },
  publishToMaven: {
    javaPackage: 'com.pharrox.jsii',
    mavenArtifactId: 'cdk-extensions',
    mavenGroupId: 'com.pharrox.jsii',
  },
  publishToPypi: {
    distName: projectName,
    module: projectName,
  },
  name: projectName,
  repositoryUrl: 'https://github.com/Pharrox/cdk-extensions.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();