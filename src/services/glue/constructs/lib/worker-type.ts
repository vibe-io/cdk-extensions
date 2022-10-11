/**
 * The type of predefined worker that is allocated when a job runs.
 *
 * If you need to use a WorkerType that doesn't exist as a static member, you
 * can instantiate a `WorkerType` object, e.g: `WorkerType.of('other type')`.
 */
 export class WorkerType {
    /**
     * Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
     */
    public static readonly STANDARD = new WorkerType('Standard');
  
    /**
     * Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
     */
    public static readonly G_1X = new WorkerType('G.1X');
  
    /**
     * Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
     */
    public static readonly G_2X = new WorkerType('G.2X');
  
    /**
     * Custom worker type
     * 
     * @param workerType custom worker type
     */
    public static of(workerType: string): WorkerType {
        return new WorkerType(workerType);
    }
  
    /**
     * The name of this WorkerType, as expected by Job resource.
     */
    public readonly name: string;
  
    private constructor(name: string) {
        this.name = name;
    }
}
