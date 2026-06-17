type AddKind = "file" | "folder";
export declare function add(name: string, location: string, kind?: AddKind): Promise<void>;
export declare function addMany(names: string[], location: string, kind?: AddKind): Promise<void>;
export type { AddKind };
//# sourceMappingURL=add.d.ts.map