import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "@/constants";
import { formatSctreeAst } from "@/libs/formatter";
import { findSctreePath } from "@/libs/paths";
import { mergeMissingNodes, scanProjectTree } from "@/libs/scanner";
import { parseSctree } from "@/libs/sctree";
import fs from "fs-extra";
import pc from "picocolors";

async function update() {
	intro(pc.bold("sctree update"));

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
			pc.red(`No .sctree file found in ${OUTPUT_DIR}/. Run \`sctree scan\` or \`sctree init\` first.`),
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

	const scannedRoot = await scanProjectTree({
		rootName: parsed.root.name,
	});
	const added = mergeMissingNodes(parsed.root, scannedRoot);

	if (added === 0) {
		outro(pc.green("SCT document already matches scanned project entries."));
		return;
	}

	await fs.writeFile(outputPath, formatSctreeAst(parsed), "utf8");
	outro(pc.green(`Updated SCT document with ${added} missing entr${added === 1 ? "y" : "ies"}.`));
}

export { update };
