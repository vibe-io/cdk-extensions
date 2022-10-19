export enum ReplicationStatus {
  DISABLED = 'Disabled',
  ENABLED = 'Enabled'
}

export enum ReplicationStorageClass {
  DEEP_ARCHIVE = 'DEEP_ARCHIVE',
  GLACIER = 'GLACIER',
  GLACIER_IR = 'GLACIER_IR',
  INTELLIGENT_TIERING = 'INTELLIGENT_TIERING',
  ONEZONE_IA = 'ONEZONE_IA',
  OUTPOSTS = 'OUTPOSTS',
  REDUCED_REDUNDANCY = 'REDUCED_REDUNDANCY',
  STANDARD = 'STANDARD',
  STANDARD_IA = 'STANDARD_IA'
}

/*export interface ReplicationRuleConfiguration {
    readonly id?: string;
    readonly prefix?: ;
    readonly priority?: number;
    readonly sourceSelectionCriteria?: ;
    readonly status?: ReplicationStatus;
    readonly storageClass?: ReplicationStorageClass;
}*/
