import { cancel, intro, outro } from "@clack/prompts";
import { findSctPath } from "@/libs/paths";
import { renderTree } from "@/libs/render-tree";
import { parseSct } from "@/libs/sct";
import fs from "fs-extra";
import pc from "picocolors";

export async function render() {
	intro(pc.bold("sct render"));

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
		console.error(pc.red("No .sct file found in out/. Run `sct init` first."));
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

	console.log(renderTree(parsed.root));
	outro(pc.green("Rendered tree"));
}
