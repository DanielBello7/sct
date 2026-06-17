import type { TreeNode } from "./sctree";

function locationParts(location: string, rootName: string) {
	const parts = location
		.split("/")
		.map((part) => part.trim())
		.filter((part) => part && part !== ".");

	if (parts.some((part) => part === "..")) {
		throw new Error("Location cannot contain '..'.");
	}

	if (parts[0] === rootName) {
		return parts.slice(1);
	}

	return parts;
}

function findFolder(root: TreeNode, location: string) {
	const parts = locationParts(location, root.name);
	let current = root;

	for (const part of parts) {
		const next = current.children.find(
			(child) => child.type === "folder" && child.name === part,
		);

		if (!next) {
			return undefined;
		}

		current = next;
	}

	return current;
}

function findOrCreateFolder(parent: TreeNode, name: string) {
	const existing = parent.children.find(
		(child) => child.type === "folder" && child.name === name,
	);

	if (existing) {
		return existing;
	}

	const folder: TreeNode = { type: "folder", name, children: [] };
	parent.children.push(folder);
	return folder;
}

export { locationParts, findFolder, findOrCreateFolder };
