export type TreeNode = {
	type: "folder" | "file";
	name: string;
	children: TreeNode[];
};

export type SctreeAst = {
	metadataLines: string[];
	root: TreeNode;
};

export function parseSctree(source: string): SctreeAst {
	const lines = source.split(/\r?\n/);
	const metadataLines: string[] = [];
	const stack: TreeNode[] = [];
	let root: TreeNode | undefined;
	let hasTree = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (!trimmed) {
			continue;
		}

		const folderMatch = trimmed.match(/^(root\s+)?folder\s+(.+?)\s*\{$/);
		const fileMatch = trimmed.match(/^file\s+(.+)$/);

		if (folderMatch) {
			hasTree = true;
			const isRoot = Boolean(folderMatch[1]);

			const folder: TreeNode = {
				type: "folder",
				name: folderMatch[2].trim(),
				children: [],
			};
			const parent = stack.at(-1);

			if (isRoot && parent) {
				throw new Error("Root folder cannot be nested.");
			}

			if (isRoot && root) {
				throw new Error("Only one root folder is allowed.");
			}

			if (parent) {
				parent.children.push(folder);
			} else if (isRoot) {
				root = folder;
			} else {
				throw new Error("Top-level folders must use `root folder`.");
			}

			stack.push(folder);
			continue;
		}

		if (fileMatch) {
			hasTree = true;

			const parent = stack.at(-1);

			if (!parent) {
				throw new Error(`File declared outside of a folder: ${trimmed}`);
			}

			parent.children.push({
				type: "file",
				name: fileMatch[1].trim(),
				children: [],
			});
			continue;
		}

		if (trimmed === "}") {
			if (!stack.pop()) {
				throw new Error("Unexpected closing brace.");
			}

			continue;
		}

		if (!hasTree) {
			metadataLines.push(trimmed);
		}
	}

	if (stack.length > 0) {
		throw new Error("Unclosed folder block.");
	}

	if (!root) {
		throw new Error("No root folder found. Run `sctree init` first.");
	}

	return { metadataLines, root };
}

export function serializeNode(node: TreeNode, depth = 0): string[] {
	const indent = "  ".repeat(depth);

	if (node.type === "file") {
		return [`${indent}file ${node.name}`];
	}

	return [
		`${indent}folder ${node.name} {`,
		...node.children.flatMap((child) => serializeNode(child, depth + 1)),
		`${indent}}`,
	];
}

export function serializeRoot(root: TreeNode) {
	return [
		`root folder ${root.name} {`,
		...root.children.flatMap((child) => serializeNode(child, 1)),
		"}",
	];
}

export function serializeSctree(metadataLines: string[], root: TreeNode) {
	return `${metadataLines.join("\n")}\n\n${serializeRoot(root)
		.join("\n")}\n`;
}
