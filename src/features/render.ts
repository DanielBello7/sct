import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "@/constants";
import { findSctPath } from "@/libs/paths";
import { renderHtml } from "@/libs/render-html";
import { renderTree } from "@/libs/render-tree";
import { renderTxt } from "@/libs/render-txt";
import { parseSct } from "@/libs/sct";
import fs from "fs-extra";
import { join } from "node:path";
import pc from "picocolors";

type RenderOptions = {
	html?: boolean;
	txt?: boolean;
};

export async function render(options: RenderOptions = {}) {
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

	if (options.html && options.txt) {
		cancel("Choose one render output: --html or --txt.");
		process.exit(1);
	}

	if (options.html) {
		const htmlPath = join(
			process.cwd(),
			OUTPUT_DIR,
			`${parsed.root.name}.html`,
		);
		await fs.outputFile(htmlPath, renderHtml(parsed), "utf8");
		outro(
			pc.green(
				`Rendered HTML preview to ${OUTPUT_DIR}/${parsed.root.name}.html`,
			),
		);
		return;
	}

	if (options.txt) {
		const txtPath = join(process.cwd(), OUTPUT_DIR, `${parsed.root.name}.txt`);
		await fs.outputFile(txtPath, renderTxt(parsed), "utf8");
		outro(
			pc.green(`Rendered text preview to ${OUTPUT_DIR}/${parsed.root.name}.txt`),
		);
		return;
	}

	console.log(renderTree(parsed.root));
	outro(pc.green("Rendered tree"));
}

export type { RenderOptions };
