import { Lazy } from 'aws-cdk-lib';
import { Connection } from '../../connection';
import { Crawler, CrawlerTargetCollection, ICrawlerTarget } from '../../crawler';


/**
 * Configuration for Crawler JDBC target
 */
export interface JdbcTargetOptions {
  readonly exclusions?: string[];
  readonly paths?: string[];
}

export class JdbcTarget implements ICrawlerTarget {
  // Internal properties
  private readonly _exclusions: string[] = [];
  private readonly _paths: string[] = [];

  // Input properties
  public readonly connection: Connection;


  constructor(connection: Connection, options: JdbcTargetOptions) {
    this.connection = connection;

    options.exclusions?.forEach((x) => {
      this.addExclusion(x);
    });

    options.paths?.forEach((x) => {
      this.addPath(x);
    });
  }

  public addExclusion(exclusion: string): void {
    this._exclusions.push(exclusion);
  }

  public addPath(path: string): void {
    this._paths.push(path);
  }

  public bind(_crawler: Crawler): CrawlerTargetCollection {
    const paths: (string | undefined)[] = !!this._paths.length ? this._paths : [undefined];

    return {
      jdbcTargets: paths.map((x) => {
        return {
          connectionName: this.connection.connectionName,
          exclusions: Lazy.uncachedList(
            {
              produce: () => {
                return this._exclusions;
              },
            },
            {
              omitEmpty: true,
            },
          ),
          path: x,
        };
      }),
    };
  }
}