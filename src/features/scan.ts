import { intro, outro } from "@clack/prompts";
import {
	DEFAULT_FRAMEWORK,
	DEFAULT_LANGUAGE,
	DEFAULT_PROJECT_TYPE,
	DEFAULT_VERSION,
} from "@/constants";
import { formatSctDocument } from "@/libs/formatter";
import { displaySctreePath, sctreePathForProject } from "@/libs/paths";
import { scanProjectTree } from "@/libs/scanner";
import type { ProjectMetadata } from "@/types";
import fs from "fs-extra";
import { basename, resolve } from "node:path";
import pc from "picocolors";

type ScanOptions = Partial<ProjectMetadata> & {
	force?: boolean;
};

async function scan(options: ScanOptions) {
	intro(pc.bold("sctree scan"));

	const cwd = process.cwd();
	const name = options.name ?? basename(resolve(cwd));
	const metadata: ProjectMetadata = {
		name,
		type: options.type ?? DEFAULT_PROJECT_TYPE,
		language: options.language ?? DEFAULT_LANGUAGE,
		framework: options.framework ?? DEFAULT_FRAMEWORK,
		version: options.version ?? DEFAULT_VERSION,
		author: options.author ?? "",
		description: options.description ?? "",
	};
	const outputPath = sctreePathForProject(metadata.name);

	if ((await fs.pathExists(outputPath)) && !options.force) {
		console.error(
			pc.red(`Refusing to overwrite existing file: ${displaySctreePath(metadata.name)}`),
		);
		process.exit(1);
	}

	const root = await scanProjectTree({ cwd, rootName: metadata.name });
	await fs.outputFile(outputPath, formatSctDocument(metadata, root), "utf8");

	outro(pc.green(`Scanned project into ${displaySctreePath(metadata.name)}`));
}

export { scan };
export type { ScanOptions };
