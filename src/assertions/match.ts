import { Intrinsic, Stack, Token, Tokenization } from 'aws-cdk-lib';
import { Match as CdkMatch, Matcher, MatchResult } from 'aws-cdk-lib/assertions';


export class Match extends CdkMatch {
  public static joinedJson(pattern: any): Matcher {
    return new JoinedJson(pattern);
  }
}

class JoinedJson extends Matcher {
  private static parseInput(join: any): any {
    const joinArgs: any[] = join['Fn::Join'];
    const sep: string = joinArgs[0];
    const input: any[] = joinArgs[1];

    const output: string[] = [];
    input.forEach((x) => {
      if (typeof x === 'string') {
        output.push(x);
      } else {
        output.push(Token.asNumber(x).toString());
      }
    });

    const joined = output.join(sep);
    const fullObj = JSON.parse(joined);
    return JoinedJson.recursiveResolve(fullObj);
  }

  private static recursiveResolve(obj: any): any {
    if (typeof obj === 'string') {
      if (Token.isUnresolved(obj)) {
        const parts = Tokenization.reverseString(obj);
        const unresolvedFragments: string[] = JoinedJson.coerceArray(parts.join({
          join: (a, b) => {
            const standardA = JoinedJson.coerceArray(a);
            return standardA.concat(JoinedJson.coerceArray(b));
          },
        }));
        const intrinsicFragments: any[] = unresolvedFragments.map((x) => {
          return Token.isUnresolved(x) ? Tokenization.reverseCompleteString(x) : x;
        });
        const objectFragments: any[] = intrinsicFragments.map((x) => {
          if (typeof x === 'string') {
            return x;
          } else if (x instanceof Intrinsic) {
            return x.resolve({
              documentPath: [],
              preparing: false,
              registerPostProcessor: (_postProcessor): void => {},
              resolve: (_x, _options) => { return undefined; },
              scope: new Stack(undefined, 'resolver'),
            });
          } else {
            throw new Error('Got unexpected type while resolving objects.');
          }
        });
        return (objectFragments.length === 1 && typeof objectFragments[0] !== 'string') ? objectFragments[0] : {
          'Fn::Join': ['', objectFragments],
        };
      } else {
        return obj;
      }
    } else if (Array.isArray(obj)) {
      return obj.map((x) => {
        return JoinedJson.recursiveResolve(x);
      });
    } else if (typeof obj === 'object') {
      return Object.keys(obj).reduce((prev, cur) => {
        prev[cur] = JoinedJson.recursiveResolve(obj[cur]);
        return prev;
      }, {} as {[key: string]: any});
    } else {
      return obj;
    }
  }

  private static coerceArray(obj: any): any[] {
    return Array.isArray(obj) ? obj : [obj];
  }

  public readonly name: string;
  private readonly pattern: any;

  constructor(pattern: any) {
    super();
    this.name = 'joinedManifest',
    this.pattern = pattern;
  }

  test(actual: any): MatchResult {
    const result = new MatchResult(actual);

    let parsed = actual;
    if (typeof parsed !== 'string') {
      parsed = JoinedJson.parseInput(actual);
    }

    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : Match.exact(this.pattern);
    const innerResult = matcher.test(parsed);
    result.compose(`(${this.name})`, innerResult);

    return result;
  }
}