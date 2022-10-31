import { Lazy } from 'aws-cdk-lib';
import { Connection } from '../../connection';
import { Crawler, CrawlerTargetCollection, ICrawlerTarget } from '../../crawler';


/**
 * Configuration for Crawler JDBC target
 */
export interface JdbcTargetOptions {
  /**
   * A list of glob patterns used to exclude from the crawl. For more information
   *
   * @see [Catalog Tables with a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html)
   */
  readonly exclusions?: string[];
  /**
   * The path of the JDBC target.
   *
   * @see [AWS::Glue::Crawler JdbcTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-path)
   */
  readonly paths?: string[];
}

export class JdbcTarget implements ICrawlerTarget {
  // Internal properties
  private readonly _exclusions: string[] = [];
  private readonly _paths: string[] = [];

  // Input properties
  public readonly connection: Connection;

  /**
     * Creates a new instance of the JdbcTarget class.
     *
     * @param scope A Connection Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
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