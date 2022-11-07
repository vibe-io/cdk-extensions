TODO: Build this out into an actual document.

Goals:
* All L2 resources should expose all possible configurations of the underlying L1 construct
* All fields in an L2 construct should be dynamically configurable where practical
** Any configuration/object arrays should support `addX` methods on the L2 class
* Escape hatches should be provided wherever is practical to allow new configurations and features that get introduced by AWS.
** This includes using classes with static, preset values and `of` functions rather than enums where there is potential for possibilities to be expanded.
** For resources that take sub-objects representing a possible implementation this would include writing custom object escape hatches.
* We want to make it as difficult as possible to write invalid code.
** Where practical, mutually exclusive configurations should be exposed through helper configuration classes to make inputting invalid configuration impossible.
* Where CDK provided interfaces are exposed they **must** be implemented
* All constructs should implement best practice by default
** For things like logging an encryption, they should be set up automatically and the user should have to opt out of them rather than opting into them