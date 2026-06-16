import { cancel, intro, outro } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { findSctreePath } from "@/libs/paths.ts";
import { renderTree } from "@/libs/render-tree.ts";
import { parseSctree } from "@/libs/sctree.ts";

export async function render() {
	intro(pc.bold("sctree render"));

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

	console.log(renderTree(parsed.root));
	outro(pc.green("Rendered tree"));
}
