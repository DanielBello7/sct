import { METADATA_ORDER, METADATA_KEY_WIDTH } from "@/constants";
import type { SctreeAst, TreeNode } from "@/libs/sctree";
import type { ProjectMetadata } from "@/types";
import type { MetadataKey } from "@/types";

function formatMetadataLine(key: MetadataKey, value: string) {
	return `${key.padEnd(METADATA_KEY_WIDTH)}= ${JSON.stringify(value)}`;
}

function formatMetadata(metadata: ProjectMetadata) {
	return METADATA_ORDER.flatMap((key) => {
		const value = metadata[key];

		if (typeof value !== "string" || value.trim() === "") {
			return [];
		}

		return formatMetadataLine(key, value);
	});
}

function formatMetadataLines(lines: string[]) {
	const entries = new Map<MetadataKey, string>();

	for (const line of lines) {
		const match = line.match(
			/^(name|type|language|framework|version|author|description)\s*=\s*(.+)$/,
		);

		if (!match) {
			continue;
		}

		const key = match[1] as MetadataKey;
		const value = normalizeMetadataValue(match[2] ?? "");
		entries.set(key, value);
	}

	return METADATA_ORDER.flatMap((key) => {
		const value = entries.get(key);
		return value ? formatMetadataLine(key, value) : [];
	});
}

function normalizeMetadataValue(value: string) {
	const trimmed = value.trim();

	if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
		try {
			const parsed = JSON.parse(trimmed);
			return typeof parsed === "string" ? parsed : String(parsed);
		} catch {
			return trimmed.slice(1, -1);
		}
	}

	return trimmed;
}

function orderedChildren(children: TreeNode[]) {
	return [...children].sort((left, right) => {
		if (left.type !== right.type) {
			return left.type === "file" ? -1 : 1;
		}

		return left.name.localeCompare(right.name);
	});
}

function formatNode(node: TreeNode, depth = 0): string[] {
	const indent = "  ".repeat(depth);

	if (node.type === "file") {
		return [`${indent}file ${node.name}`];
	}

	return [
		`${indent}folder ${node.name} {`,
		...orderedChildren(node.children).flatMap((child) =>
			formatNode(child, depth + 1),
		),
		`${indent}}`,
	];
}

function formatRoot(root: TreeNode) {
	return [
		`root ${root.name} {`,
		...orderedChildren(root.children).flatMap((child) => formatNode(child, 1)),
		"}",
	];
}

function formatSctDocument(metadata: ProjectMetadata, root: TreeNode) {
	return `${formatMetadata(metadata).join("\n")}

${formatRoot(root).join("\n")}
`;
}

function formatSctreeAst(ast: SctreeAst) {
	return `${formatMetadataLines(ast.metadataLines).join("\n")}\n\n${formatRoot(ast.root).join("\n")}\n`;
}

export {
	formatMetadata,
	formatMetadataLine,
	formatMetadataLines,
	formatNode,
	formatRoot,
	formatSctreeAst,
	formatSctDocument,
};
