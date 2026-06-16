import fs from "fs-extra";
import { join, resolve } from "node:path";

const OUTPUT_DIR = "out";

export function sctreePathForProject(projectName: string) {
	return resolve(process.cwd(), OUTPUT_DIR, `${projectName}.sctree`);
}

export async function findSctreePath() {
	const outputDir = resolve(process.cwd(), OUTPUT_DIR);

	if (!(await fs.pathExists(outputDir))) {
		return undefined;
	}

	const entries = await fs.readdir(outputDir);
	const sctreeFiles = entries.filter((entry) => entry.endsWith(".sctree"));

	if (sctreeFiles.length === 0) {
		return undefined;
	}

	if (sctreeFiles.length > 1) {
		throw new Error(
			`Multiple .sctree files found in ${outputDir}. Keep one active project file for now.`,
		);
	}

	return join(outputDir, sctreeFiles[0]);
}

export function displaySctreePath(projectName: string) {
	return `${OUTPUT_DIR}/${projectName}.sctree`;
}
