import type { TreeNode } from "@/libs/sctree";
import fs from "fs-extra";
import { join, resolve } from "node:path";
import { loadSctIgnore, shouldIgnorePath } from "@/libs/ignore";

type ScanOptions = {
	cwd?: string;
	rootName: string;
};

async function scanProjectTree(options: ScanOptions): Promise<TreeNode> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const patterns = await loadSctIgnore(cwd);

	return {
		type: "folder",
		name: options.rootName,
		children: await scanChildren(cwd, cwd, patterns),
	};
}

async function scanChildren(path: string, cwd: string, patterns: string[]) {
	const entries = await fs.readdir(path, { withFileTypes: true });
	const children: TreeNode[] = [];

	for (const entry of entries) {
		const childPath = join(path, entry.name);

		if (shouldIgnorePath(childPath, cwd, patterns)) {
			continue;
		}

		if (entry.isDirectory()) {
			children.push({
				type: "folder",
				name: entry.name,
				children: await scanChildren(childPath, cwd, patterns),
			});
			continue;
		}

		if (entry.isFile()) {
			children.push({
				type: "file",
				name: entry.name,
				children: [],
			});
		}
	}

	return children;
}

function mergeMissingNodes(target: TreeNode, source: TreeNode) {
	let added = 0;

	for (const sourceChild of source.children) {
		const targetChild = target.children.find(
			(child) =>
				child.name === sourceChild.name && child.type === sourceChild.type,
		);

		if (!targetChild) {
			target.children.push(cloneNode(sourceChild));
			added += countNodes(sourceChild);
			continue;
		}

		if (targetChild.type === "folder" && sourceChild.type === "folder") {
			added += mergeMissingNodes(targetChild, sourceChild);
		}
	}

	return added;
}

function cloneNode(node: TreeNode): TreeNode {
	return {
		type: node.type,
		name: node.name,
		children: node.children.map(cloneNode),
	};
}

function countNodes(node: TreeNode): number {
	return (
		1 + node.children.reduce((total, child) => total + countNodes(child), 0)
	);
}

export { mergeMissingNodes, scanProjectTree };
