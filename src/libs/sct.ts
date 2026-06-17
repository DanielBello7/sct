export type TreeNode = {
	type: "folder" | "file";
	name: string;
	children: TreeNode[];
};

const RESERVED_KEYWORDS = new Set([
	"name",
	"type",
	"language",
	"framework",
	"version",
	"author",
	"root",
	"file",
	"folder",
	"description",
]);

export type SctAst = {
	metadataLines: string[];
	root: TreeNode;
};

function assertIdentifier(name: string, kind: "file" | "folder") {
	if (RESERVED_KEYWORDS.has(name)) {
		throw new Error(`${kind} identifier cannot use reserved keyword: ${name}`);
	}

	if (kind === "folder" && !/^[A-Za-z0-9_.-]+$/.test(name)) {
		throw new Error(`Invalid folder identifier: ${name}`);
	}
}

export function parseSct(source: string): SctAst {
	const lines = source.split(/\r?\n/);
	const metadataLines: string[] = [];
	const stack: TreeNode[] = [];
	let root: TreeNode | undefined;
	let hasTree = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const rootMatch = trimmed.match(/^root\s+(.+?)\s*\{$/);
		const folderMatch = trimmed.match(/^folder\s+(.+?)\s*\{$/);
		const fileMatch = trimmed.match(/^file\s+(.+)$/);

		if (rootMatch || folderMatch) {
			hasTree = true;
			const isRoot = Boolean(rootMatch);
			const name = (rootMatch?.[1] ?? folderMatch?.[1] ?? "").trim();
			assertIdentifier(name, "folder");

			const folder: TreeNode = {
				type: "folder",
				name,
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
				throw new Error("Top-level folders must use `root`.");
			}

			stack.push(folder);
			continue;
		}

		if (fileMatch) {
			hasTree = true;
			const name = (fileMatch[1] ?? "").trim();
			assertIdentifier(name, "file");

			const parent = stack.at(-1);

			if (!parent) {
				throw new Error(`File declared outside of a folder: ${trimmed}`);
			}

			parent.children.push({
				type: "file",
				name,
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
			if (!trimmed.match(/^(name|type|language|framework|version|author|description)\s*=/)) {
				throw new Error(`Unknown keyword or invalid metadata line: ${trimmed}`);
			}

			metadataLines.push(trimmed);
			continue;
		}

		throw new Error(`Unknown keyword or invalid syntax: ${trimmed}`);
	}

	if (stack.length > 0) {
		throw new Error("Unclosed folder block.");
	}

	if (!root) {
		throw new Error("No root folder found. Run `sct init` first.");
	}

	return { metadataLines, root };
}
