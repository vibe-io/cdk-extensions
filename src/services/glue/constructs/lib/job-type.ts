/**
 * The job type.
 *
 * If you need to use a JobType that doesn't exist as a static member, you
 * can instantiate a `JobType` object, e.g: `JobType.of('other name')`.
 */
 export class JobType {
    /**
     * Command for running a Glue ETL job.
     */
    public static readonly ETL = new JobType('glueetl');
  
    /**
     * Command for running a Glue streaming job.
     */
    public static readonly STREAMING = new JobType('gluestreaming');
  
    /**
     * Command for running a Glue python shell job.
     */
    public static readonly PYTHON_SHELL = new JobType('pythonshell');
  
    /**
     * Custom type name
     * @param name type name
     */
    public static of(name: string): JobType {
        return new JobType(name);
    }
  
    /**
     * The name of this JobType, as expected by Job resource.
     */
    public readonly name: string;
  
    private constructor(name: string) {
        this.name = name;
    }
}
