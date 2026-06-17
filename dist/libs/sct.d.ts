export type TreeNode = {
    type: "folder" | "file";
    name: string;
    children: TreeNode[];
};
export type SctAst = {
    metadataLines: string[];
    root: TreeNode;
};
export declare function parseSct(source: string): SctAst;
//# sourceMappingURL=sct.d.ts.map