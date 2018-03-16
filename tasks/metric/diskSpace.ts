export interface IDiskSpace {
    Filesystem: string;
    Blocks: number;
    Used: number;
    UsedAvailable: number;
    Capacity: number;
    MountedOn: number;
}
