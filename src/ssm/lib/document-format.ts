export class DocumentFormat {
  public static readonly JSON: DocumentFormat = DocumentFormat.of('JSON');
  public static readonly TEXT: DocumentFormat = DocumentFormat.of('TEXT');
  public static readonly YAML: DocumentFormat = DocumentFormat.of('YAML');

  public static of(value: string): DocumentFormat {
    return new DocumentFormat(value);
  }


  private constructor(public readonly value: string) {}
}