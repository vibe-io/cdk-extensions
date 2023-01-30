import { randomUUID } from 'crypto';
import { IConstruct } from 'constructs';


/**
 * Provides a means of storing and retrieving arbitrary data that can be
 * associated with a construct.
 */
export class State {
  /**
   * Gets an object that allows for interacting with the stored state of a
   * construct.
   *
   * @param scope The construct for which state information is desired.
   * @returns An object that provides a means for interacting with the stored
   * state of the construct.
   */
  public static of(scope: IConstruct): State {
    return new State(scope);
  }

  /**
   * The metadata key added to the root node in a construct tree to
   * differentiate it from other construct trees that are part of the same
   * build.
   */
  private static readonly METADATA_KEY: string = '_state_uuid';

  /**
   * The full state data for all constructs.
   */
  private static readonly _data: { [store: string]: { [construct: string]: { [key: string]: string } } } = {};

  /**
   * State is tracked by construst addresses which are always unique withing
   * the construct tree.
   *
   * As state is stored globally this can cause problems if there are multiple
   * construct tree that are part of the current application.
   *
   * To avoid collissions we generate a new UUID for each unique construct tree
   * for which state is requested. The UUID is stored as metadata on the root
   * node of the costruct tree. This allows data for the same construct tree to
   * be stored together and retrieved repeatedly as needed.
   *
   * @param scope The construct to get the store key from.
   * @returns A unique ID that represents the construct tree the given scope
   * belongs to.
   */
  private static getStoreKey(scope: IConstruct): string {
    const state = scope.node.root.node.metadata.find((x) => {
      return x.type === State.METADATA_KEY;
    });

    const output = String(state?.data ?? randomUUID());
    if (state === undefined) {
      scope.node.root.node.addMetadata(State.METADATA_KEY, output, {
        stackTrace: false,
      });
    }

    return output;
  }


  /**
   * The construct which is having its state managed.
   */
  private readonly _scope: IConstruct;

  /**
   * An ID that uniquely identifies the construct tree which the construct
   * having its state managed belongs to.
   */
  private readonly _storeKey: string;

  /**
   * Provides a shortcut to the state for the construct associated with the
   * state manager.
   */
  private get _store(): { [key: string]: any } {
    return State._data[this._storeKey][this._scope.node.addr];
  }

  /**
   * Creates a new instance of the state class.
   *
   * @param scope The construct that is having its state managed.
   */
  private constructor(scope: IConstruct) {
    this._scope = scope;
    this._storeKey = State.getStoreKey(scope);

    this._ensureInitialized();
  }

  /**
   * Ensures full global state tracking is available for the node.
   */
  private _ensureInitialized(): void {
    if (!(this._storeKey in State._data)) {
      State._data[this._storeKey] = {};
    }

    if (!(this._scope.node.addr in State._data[this._storeKey])) {
      State._data[this._storeKey][this._scope.node.addr] = {};
    }
  }

  /**
   * Gets the value of a key from state.
   *
   * @param key The key to get from state.
   * @param defaultValue The value to return if the requested key does not
   * exist in state.
   * @returns The value of the requested key or `defaultValue` if the requested
   * key was not found.
   */
  public get(key: string, defaultValue?: any): any | undefined {
    return key in this._store ? this._store[key] : defaultValue;
  }

  /**
   * Sets the value of a key in state.
   *
   * @param key The key to set in state.
   * @param value The value to set for the key in state.
   * @returns The previous value for the key that was set (if one exists).
   */
  public set(key: string, value: any): any | undefined {
    const cur = this.get(key);
    this._store[key] = value;
    return cur;
  }
}