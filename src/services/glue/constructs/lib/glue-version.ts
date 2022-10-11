export class GlueVersion {
    /**
     * Glue version using Spark 2.2.1 and Python 2.7
     */
    public static readonly V0_9 = new GlueVersion('0.9');
  
    /**
     * Glue version using Spark 2.4.3, Python 2.7 and Python 3.6
     */
    public static readonly V1_0 = new GlueVersion('1.0');
  
    /**
     * Glue version using Spark 2.4.3 and Python 3.7
     */
    public static readonly V2_0 = new GlueVersion('2.0');
  
    /**
     * Glue version using Spark 3.1.1 and Python 3.7
     */
    public static readonly V3_0 = new GlueVersion('3.0');
  
    /**
     * Custom Glue version
     * @param version custom version
     */
    public static of(version: string): GlueVersion {
      return new GlueVersion(version);
    }
  
    /**
     * The name of this GlueVersion, as expected by Job resource.
     */
    public readonly name: string;
  
    private constructor(name: string) {
      this.name = name;
    }
  }
  