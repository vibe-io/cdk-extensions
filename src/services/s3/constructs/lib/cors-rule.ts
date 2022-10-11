import { Duration, Lazy } from "aws-cdk-lib";


export interface CorsRuleConfiguration {
    readonly allowedHeaders?: string[];
    readonly allowedMethods: string[];
    readonly allowedOrigins: string[];
    readonly exposedHeaders?: string[];
    readonly id?: string;
    readonly maxAge?: Duration;
}

export interface CorsRuleOptions {
    readonly allowedHeaders?: string[];
    readonly allowedMethods?: string[];
    readonly allowedOrigins?: string[];
    readonly exposedHeaders?: string[];
    readonly id?: string;
    readonly maxAge?: Duration;
}

export class CorsRule implements CorsRuleConfiguration {
    // Internal properties
    private readonly _allowedHeaders: string[] = [];
    private readonly _allowedMethods: string[] = [];
    private readonly _allowedOrigins: string[] = [];
    private readonly _exposedHeaders: string[] = [];

    // CorsRuleConfiguration properties
    public readonly allowedHeaders?: string[];
    public readonly allowedMethods: string[];
    public readonly allowedOrigins: string[];
    public readonly exposedHeaders?: string[];
    public readonly id?: string;
    public readonly maxAge?: Duration;


    public constructor(options: CorsRuleOptions) {
        this.id = options.id;
        this.maxAge = options.maxAge;

        this.allowedHeaders = Lazy.list(
            {
                produce: () => {
                    return this._allowedHeaders;
                }
            },
            {
                omitEmpty: true
            }
        );

        this.allowedMethods = Lazy.list(
            {
                produce: () => {
                    return this._allowedMethods;
                }
            }
        );

        this.allowedOrigins = Lazy.list(
            {
                produce: () => {
                    return this._allowedOrigins;
                }
            }
        );

        this.exposedHeaders = Lazy.list(
            {
                produce: () => {
                    return this._exposedHeaders;
                }
            },
            {
                omitEmpty: true
            }
        );
    }

    public addAllowedHeader(header: string): CorsRule {
        this._allowedHeaders.push(header);
        return this;
    }

    public addAllowedMethod(method: string): CorsRule {
        this._allowedMethods.push(method);
        return this;
    }

    public addAllowedOrigin(origin: string): CorsRule {
        this._allowedOrigins.push(origin);
        return this;
    }

    public addExposedHeader(header: string): CorsRule {
        this._exposedHeaders.push(header);
        return this;
    }
}