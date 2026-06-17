import { DEFAULT_IGNORE_PATTERNS } from "@/constants";
import { DEFAULT_CONFIG } from "@/libs/config";
import fs from "fs-extra";
import { resolve } from "node:path";

const SCTIGNORE_FILE = ".sctreeignore";
const SCT_CONFIG_FILE = "sctree.config.json";

async function ensureProjectSupportFiles(cwd = process.cwd()) {
	const created: string[] = [];

	if (await writeIfMissing(resolve(cwd, SCTIGNORE_FILE), defaultSctIgnore())) {
		created.push(SCTIGNORE_FILE);
	}

	if (
		await writeIfMissing(resolve(cwd, SCT_CONFIG_FILE), defaultSctConfig())
	) {
		created.push(SCT_CONFIG_FILE);
	}

	return created;
}

function defaultSctIgnore() {
	return [
		"# Folders and files ignored by `sctree scan` and `sctree update`.",
		...DEFAULT_IGNORE_PATTERNS,
		"",
	].join("\n");
}

function defaultSctConfig() {
	return `${JSON.stringify(DEFAULT_CONFIG, null, "\t")}\n`;
}

async function writeIfMissing(path: string, content: string) {
	if (await fs.pathExists(path)) {
		return false;
	}

	await fs.outputFile(path, content, "utf8");
	return true;
}

export {
	SCT_CONFIG_FILE,
	SCTIGNORE_FILE,
	defaultSctConfig,
	defaultSctIgnore,
	ensureProjectSupportFiles,
};
