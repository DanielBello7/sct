import type { SctAst, TreeNode } from "./sct";
import type { ProjectMetadata } from "../types";
import type { MetadataKey } from "../types";
declare function formatMetadataLine(key: MetadataKey, value: string): string;
declare function formatMetadata(metadata: ProjectMetadata): string[];
declare function formatMetadataLines(lines: string[]): string[];
declare function formatNode(node: TreeNode, depth?: number): string[];
declare function formatRoot(root: TreeNode): string[];
declare function formatSctDocument(metadata: ProjectMetadata, root: TreeNode): string;
declare function formatSctAst(ast: SctAst): string;
export { formatMetadata, formatMetadataLine, formatMetadataLines, formatNode, formatRoot, formatSctAst, formatSctDocument, };
//# sourceMappingURL=formatter.d.ts.map