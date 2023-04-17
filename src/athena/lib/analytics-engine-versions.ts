export abstract class AnalyticsEngineVersion {
  public abstract readonly name: string;
}

export class AthenaSqlEngineVersion extends AnalyticsEngineVersion {
  public static readonly AUTO: AthenaSqlEngineVersion = AthenaSqlEngineVersion.of('AUTO');
  public static readonly V2: AthenaSqlEngineVersion = AthenaSqlEngineVersion.of('Athena engine version 2');
  public static readonly V3: AthenaSqlEngineVersion = AthenaSqlEngineVersion.of('Athena engine version 3');

  public static of(name: string): AthenaSqlEngineVersion {
    return new AthenaSqlEngineVersion(name);
  }


  private constructor(public readonly name: string) {
    super();
  }
}

export class ApacheSparkEngineVersion extends AnalyticsEngineVersion {
  public static readonly AUTO: ApacheSparkEngineVersion = ApacheSparkEngineVersion.of('AUTO');
  public static readonly V3: ApacheSparkEngineVersion = ApacheSparkEngineVersion.of('PySpark engine version 3');

  public static of(name: string): ApacheSparkEngineVersion {
    return new ApacheSparkEngineVersion(name);
  }


  private constructor(public readonly name: string) {
    super();
  }
}