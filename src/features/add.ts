import { parseSctree, serializeSctree } from "@/libs/sctree.ts";
import { cancel, intro, outro } from "@clack/prompts";
import { findSctreePath } from "@/libs/paths.ts";
import { findOrCreateFolder, locationParts } from "@/libs/tree-paths.ts";
import fs from "fs-extra";
import pc from "picocolors";

export async function add(filename: string, location: string) {
	intro(pc.bold("sctree add"));

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
	const parts = locationParts(location, root.name);
	let current = root;

	for (const part of parts) {
		current = findOrCreateFolder(current, part);
	}

	const existingFile = current.children.find(
		(child) => child.type === "file" && child.name === filename,
	);

	if (existingFile) {
		outro(pc.yellow(`${filename} already exists in ${location}`));
		return;
	}

	current.children.push({ type: "file", name: filename, children: [] });
	await fs.writeFile(outputPath, serializeSctree(metadataLines, root), "utf8");
	outro(pc.green(`Added ${filename} to ${location}`));
}
