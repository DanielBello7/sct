import { formatSctreeAst } from "@/libs/formatter";
import { parseSctree } from "@/libs/sctree";
import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "@/constants";
import { loadSctConfig } from "@/libs/config";
import { findSctreePath } from "@/libs/paths";
import { findOrCreateFolder, locationParts } from "@/libs/tree-paths";
import fs from "fs-extra";
import { join } from "node:path";
import pc from "picocolors";

type AddKind = "file" | "folder";

export async function add(
	name: string,
	location: string,
	kind: AddKind = "file",
) {
	await addMany([name], location, kind);
}

export async function addMany(
	names: string[],
	location: string,
	kind: AddKind = "file",
) {
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
			pc.red(`No .sctree file found in ${OUTPUT_DIR}/. Run \`sctree init\` first.`),
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

	const parts = locationParts(location, parsed.root.name);
	let current = parsed.root;

	for (const part of parts) {
		current = findOrCreateFolder(current, part);
	}

	const added: string[] = [];
	const skipped: string[] = [];

	for (const name of names) {
		const existingEntry = current.children.find((child) => child.name === name);

		if (existingEntry) {
			skipped.push(name);
			continue;
		}

		current.children.push({ type: kind, name, children: [] });
		added.push(name);
	}

	if (added.length === 0) {
		outro(pc.yellow(`No entries added. Already exists: ${skipped.join(", ")}`));
		return;
	}

	await fs.writeFile(outputPath, formatSctreeAst(parsed), "utf8");
	await applyFilesystemAdd({
		added,
		kind,
		locationParts: parts,
	});

	const skippedMessage =
		skipped.length > 0 ? pc.yellow(` Skipped: ${skipped.join(", ")}`) : "";

	outro(
		pc.green(
			`Added ${added.length} ${kind}${added.length === 1 ? "" : "s"} to ${location}.`,
		) + skippedMessage,
	);
}

async function applyFilesystemAdd(options: {
	added: string[];
	kind: AddKind;
	locationParts: string[];
}) {
	const config = await loadSctConfig();

	if (!config.filesystem.applyOnAdd) {
		return;
	}

	const destination = join(process.cwd(), ...options.locationParts);
	await fs.ensureDir(destination);

	for (const name of options.added) {
		const path = join(destination, name);

		if (options.kind === "folder") {
			await fs.ensureDir(path);
			continue;
		}

		await fs.ensureFile(path);
	}
}

export type { AddKind };
