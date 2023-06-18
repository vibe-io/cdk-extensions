import { IConstruct } from 'constructs';
import { BoundGroupConfiguration, IGroupConfiguration } from './configuration-ref';


/**
 * Configuration options for configuring a Resource Group containing resources
 * based on a set of matching tags.
 */
export class TagFilterProps {
  /**
   * The resource types that are allowed to be in the Resource Group being
   * configured.
   */
  readonly resourceTypes?: string[];

  /**
   * The filters that should be used to determine the resources that belong to
   * the resource group.
   */
  readonly tagFilters?: {[key: string]: string[]};
}

export class TagFilter implements IGroupConfiguration {
  /**
   * Internal collection of resource types that are allowed to be in the
   * Resource Group being configured.
   */
  private readonly _resourceTypes: Set<string>;

  /**
   * Internal collection of filters to be used to determine the resources that
   * belong to the Resource Group.
   */
  private readonly _tagFilters: {[key: string]: Set<string>};

  /**
   * Collection of resource types that are allowed to be in the Resource Group
   * being configured.
   */
  public get resourceTypes(): string[] {
    return Array.from(this._resourceTypes);
  }

  /**
   * Collection of filters to be used to determine the resources that belong to
   * the Resource Group.
   */
  public get tagFilters(): {[key: string]: string[]} {
    return Object.keys(this._tagFilters).reduce((prev, cur) => {
      const set = this._tagFilters[cur];
      if (set && set.size > 0) {
        prev[cur] = Array.from(set);
      }

      return prev;
    }, {} as {[key: string]: string[]});
  }


  /**
   * Creates a new instance of the TagFilter class.
   *
   * @param props Settings to use when applying the tag filter.
   */
  public constructor(props: TagFilterProps = {}) {
    this._resourceTypes = new Set();
    this._tagFilters = {};

    const filters = props.tagFilters;
    if (filters) {
      Object.keys(filters).forEach((x) => {
        this.addTagFilter(x, ...filters[x]);
      });
    }

    props.resourceTypes?.forEach((x) => {
      this.addResourceType(x);
    });
  }

  /**
   * Add a resource type to the resource group.
   *
   * If no resource types are registered in the configuration then all resource
   * types are allowed.
   *
   * @param typeId The type that is to be added to the resource group.
   * @returns The Resource Group configuration object to which the type was
   * registered.
   */
  public addResourceType(typeId: string): TagFilter {
    this._resourceTypes.add(typeId);
    return this;
  }

  /**
   * Adds a new tag filter that should be used for controlling the resources in
   * the Resource Group.
   *
   * @param key The name of the tag to be filtered on.
   * @param values Values to match for the given tag.
   * @returns The Resource Group configuration object to which the type was
   * registered.
   */
  public addTagFilter(key: string, ...values: string[]): TagFilter {
    const set = this._tagFilters[key];
    if (set) {
      values.forEach((x) => {
        set.add(x);
      });
    } else {
      this._tagFilters[key] = new Set(values);
    }

    return this;
  }

  /**
   * Associates this configuration with a construct that is handling the
   * creation of a resource group.
   *
   * @param _scope The construct managing the creation of the Resource Group.
   * @returns The configuration to be used for the Resource Group.
   */
  public bind(_scope: IConstruct): BoundGroupConfiguration {
    throw new Error('Method not implemented.');
  }
}