import { cancel, intro, outro } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { findSctreePath } from "@/libs/paths.ts";
import { parseSctree, serializeSctree, type TreeNode } from "@/libs/sctree.ts";
import { findFolder } from "@/libs/tree-paths.ts";

function removeByName(parent: TreeNode, name: string): number {
	let removed = 0;

	const remainingChildren: TreeNode[] = [];

	for (const child of parent.children) {
		if (child.name === name) {
			removed += 1;
			continue;
		}

		if (child.type === "folder") {
			removed += removeByName(child, name);
		}

		remainingChildren.push(child);
	}

	parent.children = remainingChildren;
	return removed;
}

function removeDirectChild(parent: TreeNode, name: string): number {
	const before = parent.children.length;
	parent.children = parent.children.filter((child) => child.name !== name);
	return before - parent.children.length;
}

export async function rm(name: string, location?: string) {
	intro(pc.bold("sctree rm"));

	let outputPath: string | undefined;

	try {
		outputPath = await findSctreePath();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Could not locate .sctree file.";
		cancel(message);
		process.exit(1);
	}

	if (!outputPath) {
		console.error(
			pc.red("No .sctree file found in out/. Run `sctree init` first."),
		);
		process.exit(1);
	}

	const source = await fs.readFile(outputPath, "utf8");
	let parsed: ReturnType<typeof parseSctree>;

	try {
		parsed = parseSctree(source);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Invalid .sctree file.";
		cancel(message);
		process.exit(1);
	}

	const { metadataLines, root } = parsed;
	const removed = location
		? removeFromLocation(root, name, location)
		: removeByName(root, name);

	if (removed === 0) {
		outro(pc.yellow(`No entries named ${name} found.`));
		return;
	}

	await fs.writeFile(outputPath, serializeSctree(metadataLines, root), "utf8");
	outro(pc.green(`Removed ${removed} entr${removed === 1 ? "y" : "ies"} named ${name}`));
}

function removeFromLocation(root: TreeNode, name: string, location: string) {
	const folder = findFolder(root, location);

	if (!folder) {
		return 0;
	}

	return removeDirectChild(folder, name);
}
