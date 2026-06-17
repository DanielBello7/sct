import type { TreeNode } from "./sct";
declare function locationParts(location: string, rootName: string): string[];
declare function findFolder(root: TreeNode, location: string): TreeNode | undefined;
declare function findOrCreateFolder(parent: TreeNode, name: string): TreeNode;
export { locationParts, findFolder, findOrCreateFolder };
//# sourceMappingURL=tree-paths.d.ts.map