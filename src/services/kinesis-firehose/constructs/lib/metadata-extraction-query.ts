import { Lazy } from "aws-cdk-lib";


export class MetaDataExtractionQuery {
    public static jq(fields: {[name: string]: string}): JsonQuery {
        return new JsonQuery(fields);
    }

    public static of(query: string): MetaDataExtractionQuery {
        return new MetaDataExtractionQuery(query);
    }

    protected query: string;

    protected constructor(query: string) {
        this.query = query;
    }

    public render(): string {
        return this.query;
    }
}

export class JsonQuery extends MetaDataExtractionQuery {
    private fields: {[name: string]: string} = {};

    public constructor(fields?: {[name: string]: string}) {
        super(Lazy.string({
            produce: () => {
                const collapsed = Object.keys(this.fields).map((x) => {
                    return `${x}: ${this.fields[x]}`
                }).join(', ');

                return `{${collapsed}}`
            }
        }));

        if (fields) {
            Object.keys(fields).forEach((x) => {
                this.addField(x, fields[x]);
            });
        }
    }

    public addField(name: string, query: string): JsonQuery {
        this.fields[name] = query;
        return this;
    }
}
