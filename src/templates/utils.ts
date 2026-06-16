import type { TreeNode } from "@/libs/sctree.ts";

export type { TreeNode };

export function file(name: string): TreeNode {
	return { type: "file", name, children: [] };
}

export function folder(name: string, children: TreeNode[] = []): TreeNode {
	return { type: "folder", name, children };
}
