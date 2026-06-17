type ProjectMetadata = {
    name: string;
    type: string;
    language: string;
    framework: string;
    version: string;
    author?: string;
    description?: string;
};
type InitOptions = Partial<ProjectMetadata> & {
    yes?: boolean;
    y?: boolean;
};
type MetadataKey = Extract<keyof ProjectMetadata, string>;
export type { InitOptions, ProjectMetadata, MetadataKey };
//# sourceMappingURL=metadata.d.ts.map