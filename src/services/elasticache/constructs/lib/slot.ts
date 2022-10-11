export class Slot {
    public static keyspace(keyspace: number): Slot {
        return new Slot(keyspace, keyspace);
    }

    public static range(start: number, end: number): Slot {
        return new Slot(start, end);
    }


    private readonly end: number;
    private readonly start: number;

    private constructor(start: number, end: number) {
        this.end = end;
        this.start = start;
    }

    public toString(): string {
        return this.start === this.end ? `${this.start}` : `${this.start}-${this.end}`;
    }
}