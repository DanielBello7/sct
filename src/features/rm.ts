import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "@/constants";
import { formatSctAst } from "@/libs/formatter";
import { findSctPath } from "@/libs/paths";
import { parseSct, type TreeNode } from "@/libs/sct";
import { findFolder } from "@/libs/tree-paths";
import fs from "fs-extra";
import pc from "picocolors";

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

function removeFromLocation(root: TreeNode, name: string, location: string) {
	const folder = findFolder(root, location);

	if (!folder) {
		return 0;
	}

	return removeDirectChild(folder, name);
}

async function rm(name: string, location?: string) {
	intro(pc.bold("sct rm"));

	let outputPath: string | undefined;

	try {
		outputPath = await findSctPath();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Could not locate .sct file.";
		cancel(message);
		process.exit(1);
	}

	if (!outputPath) {
		console.error(
			pc.red(`No .sct file found in ${OUTPUT_DIR}/. Run \`sct init\` first.`),
		);
		process.exit(1);
	}

	const source = await fs.readFile(outputPath, "utf8");
	let parsed: ReturnType<typeof parseSct>;

	try {
		parsed = parseSct(source);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Invalid .sct file.";
		cancel(message);
		process.exit(1);
	}

	const removed = location
		? removeFromLocation(parsed.root, name, location)
		: removeByName(parsed.root, name);

	if (removed === 0) {
		outro(pc.yellow(`No entries named ${name} found.`));
		return;
	}

	await fs.writeFile(outputPath, formatSctAst(parsed), "utf8");
	outro(
		pc.green(
			`Removed ${removed} entr${removed === 1 ? "y" : "ies"} named ${name}`,
		),
	);
}

export { rm };
