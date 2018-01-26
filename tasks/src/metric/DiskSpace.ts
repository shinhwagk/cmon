export interface DiskSpace {
    Filesystem: string;
    Blocks: number;
    Used: number;
    UsedAvailable: number;
    Capacity: number;
    MountedOn: number;
}