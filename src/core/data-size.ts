

export class DataSize {
  /**
     * Create a `DataSize` representing an amount of bytes.
     *
     * @param bytes The number of bytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of bytes.
     */
  public static bytes(bytes: number): DataSize {
    return new DataSize(bytes);
  }

  /**
     * Create a `DataSize` representing an amount of gibibytes.
     *
     * @param gibibytes The number of gibibytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of gibibytes.
     */
  public static gibibytes(gibibytes: number): DataSize {
    return new DataSize(gibibytes * 1024 * 1024 * 1024);
  }

  /**
     * Create a `DataSize` representing an amount of gigabytes.
     *
     * @param gigabytes The number of gigabytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of gigabytes.
     */
  public static gigabytes(gigabytes: number): DataSize {
    return new DataSize(gigabytes * 1000 * 1000 * 1000);
  }

  /**
     * Create a `DataSize` representing an amount of kibibytes.
     *
     * @param kibibytes The number of kibibytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of kibibytes.
     */
  public static kibibytes(kibibytes: number): DataSize {
    return new DataSize(kibibytes * 1024);
  }

  /**
     * Create a `DataSize` representing an amount of kilobytes.
     *
     * @param kilobytes The number of kilobytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of kilobytes.
     */
  public static kilobytes(kilobytes: number): DataSize {
    return new DataSize(kilobytes * 1000);
  }

  /**
     * Create a `DataSize` representing an amount of mebibytes.
     *
     * @param mebibytes The number of mebibytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of mebibytes.
     */
  public static mebibytes(mebibytes: number): DataSize {
    return new DataSize(mebibytes * 1024 * 1024);
  }

  /**
     * Create a `DataSize` representing an amount of megabytes.
     *
     * @param megabytes The number of megabytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of megabytes.
     */
  public static megabytes(megabytes: number): DataSize {
    return new DataSize(megabytes * 1000 * 1000);
  }

  /**
     * Create a `DataSize` representing an amount of pebibytes.
     *
     * @param pebibytes The number of pebibytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of pebibytes.
     */
  public static pebibytes(pebibytes: number): DataSize {
    return new DataSize(pebibytes * 1024 * 1024 * 1024 * 1024 * 1024);
  }

  /**
     * Create a `DataSize` representing an amount of petabytes.
     *
     * @param petabytes The number of petabytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of petabytes.
     */
  public static petabytes(petabytes: number): DataSize {
    return new DataSize(petabytes * 1000 * 1000 * 1000 * 1000 * 1000);
  }

  /**
     * Create a `DataSize` representing an amount of tebibytes.
     *
     * @param tebibytes The number of tebibytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of tebibytes.
     */
  public static tebibytes(tebibytes: number): DataSize {
    return new DataSize(tebibytes * 1024 * 1024 * 1024 * 1024);
  }

  /**
     * Create a `DataSize` representing an amount of terabytes.
     *
     * @param terabytes The number of terabytes this `DataSize` will represent.
     * @returns A `DataSize` representing the specified number of terabytes.
     */
  public static terabytes(terabytes: number): DataSize {
    return new DataSize(terabytes * 1000 * 1000 * 1000 * 1000);
  }


  /**
     * The number of bytes this object represents.
     */
  private _bytes: number;


  /**
     * Creates a new instance of the DataSize class.
     *
     * @param bytes The number of bytes being represented.
     */
  private constructor(bytes: number) {
    this._bytes = bytes;
  }

  /**
     * Convert the DataSize object to the byte representation.
     *
     * @returns The number of bytes for the data size.
     */
  public toBytes(): number {
    return this._bytes;
  }

  /**
     * Convert the DataSize object to its gibibyte representation.
     *
     * If the data size doesn't fit evently into gibibytes it will be rounded
     * up to the closest gibibyte which will be required to hold all the data.
     *
     * @returns The number of gibibytes for the data size.
     */
  public toGibibytes(): number {
    return Math.ceil(this._bytes / 1024 / 1024 / 1024);
  }

  /**
     * Convert the DataSize object to its gigabyte representation.
     *
     * If the data size doesn't fit evently into gigabytes it will be rounded
     * up to the closest gigabyte which will be required to hold all the data.
     *
     * @returns The number of gigabytes for the data size.
     */
  public toGigabytes(): number {
    return Math.ceil(this._bytes / 1000 / 1000 / 1000);
  }

  /**
     * Convert the DataSize object to its kibibyte representation.
     *
     * If the data size doesn't fit evently into kibibytes it will be rounded
     * up to the closest kibibyte which will be required to hold all the data.
     *
     * @returns The number of kibibytes for the data size.
     */
  public toKibibytes(): number {
    return Math.ceil(this._bytes / 1024);
  }

  /**
     * Convert the DataSize object to its kilobyte representation.
     *
     * If the data size doesn't fit evently into kilobytes it will be rounded
     * up to the closest kilobyte which will be required to hold all the data.
     *
     * @returns The number of kilobytes for the data size.
     */
  public toKilobytes(): number {
    return Math.ceil(this._bytes / 1000);
  }

  /**
     * Convert the DataSize object to its mebibyte representation.
     *
     * If the data size doesn't fit evently into mebibytes it will be rounded
     * up to the closest mebibyte which will be required to hold all the data.
     *
     * @returns The number of mebibytes for the data size.
     */
  public toMebibytes(): number {
    return Math.ceil(this._bytes / 1024 / 1024);
  }

  /**
     * Convert the DataSize object to its megabyte representation.
     *
     * If the data size doesn't fit evently into megabytes it will be rounded
     * up to the closest megabyte which will be required to hold all the data.
     *
     * @returns The number of megabytes for the data size.
     */
  public toMegabytes(): number {
    return Math.ceil(this._bytes / 1000 / 1000);
  }

  /**
     * Convert the DataSize object to its pebibyte representation.
     *
     * If the data size doesn't fit evently into pebibytes it will be rounded
     * up to the closest pebibyte which will be required to hold all the data.
     *
     * @returns The number of pebibytes for the data size.
     */
  public toPebibytes(): number {
    return Math.ceil(this._bytes / 1024 / 1024 / 1024 / 1024 / 1024);
  }

  /**
     * Convert the DataSize object to its petabyte representation.
     *
     * If the data size doesn't fit evently into petabytes it will be rounded
     * up to the closest petabyte which will be required to hold all the data.
     *
     * @returns The number of petabytes for the data size.
     */
  public toPetabytes(): number {
    return Math.ceil(this._bytes / 1000 / 1000 / 1000 / 1000 / 1000);
  }

  /**
     * Convert the DataSize object to its tebibyte representation.
     *
     * If the data size doesn't fit evently into tebibytes it will be rounded
     * up to the closest tebibyte which will be required to hold all the data.
     *
     * @returns The number of tebibytes for the data size.
     */
  public toTebibytes(): number {
    return Math.ceil(this._bytes / 1024 / 1024 / 1024 / 1024);
  }

  /**
     * Convert the DataSize object to its terabyte representation.
     *
     * If the data size doesn't fit evently into terabytes it will be rounded
     * up to the closest terabyte which will be required to hold all the data.
     *
     * @returns The number of terabytes for the data size.
     */
  public toTerabytes(): number {
    return Math.ceil(this._bytes / 1000 / 1000 / 1000 / 1000);
  }
}