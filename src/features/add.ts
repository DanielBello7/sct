import { formatSctAst } from "@/libs/formatter";
import { parseSct } from "@/libs/sct";
import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "@/constants";
import { findSctPath } from "@/libs/paths";
import { findOrCreateFolder, locationParts } from "@/libs/tree-paths";
import fs from "fs-extra";
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
	intro(pc.bold("sct add"));

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

	await fs.writeFile(outputPath, formatSctAst(parsed), "utf8");

	const skippedMessage =
		skipped.length > 0 ? pc.yellow(` Skipped: ${skipped.join(", ")}`) : "";

	outro(
		pc.green(
			`Added ${added.length} ${kind}${added.length === 1 ? "" : "s"} to ${location}.`,
		) + skippedMessage,
	);
}

export type { AddKind };
