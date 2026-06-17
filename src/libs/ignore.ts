import { relative, sep } from "node:path";
import { DEFAULT_IGNORE_PATTERNS } from "@/constants";
import fs from "fs-extra";

async function loadSctIgnore(cwd = process.cwd()) {
	const ignorePath = `${cwd}/.sctreeignore`;

	if (!(await fs.pathExists(ignorePath))) {
		return DEFAULT_IGNORE_PATTERNS;
	}

	const lines = await fs.readFile(ignorePath, "utf8");
	const customPatterns = lines
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith("#"));

	return [...DEFAULT_IGNORE_PATTERNS, ...customPatterns];
}

function shouldIgnorePath(path: string, cwd: string, patterns: string[]) {
	const normalized = normalizePath(relative(cwd, path));
	const parts = normalized.split("/");
	const name = parts.at(-1) ?? normalized;

	return patterns.some((pattern) => {
		const normalizedPattern = normalizePattern(pattern);

		if (!normalizedPattern) {
			return false;
		}

		if (normalizedPattern.endsWith("/")) {
			const folderPattern = normalizedPattern.slice(0, -1);
			return (
				normalized === folderPattern ||
				normalized.startsWith(`${folderPattern}/`)
			);
		}

		if (normalizedPattern.includes("*")) {
			return globToRegExp(normalizedPattern).test(normalized);
		}

		return (
			normalized === normalizedPattern ||
			normalized.startsWith(`${normalizedPattern}/`) ||
			name === normalizedPattern
		);
	});
}

function normalizePath(path: string) {
	return path.split(sep).join("/");
}

function normalizePattern(pattern: string) {
	return pattern.replaceAll("\\", "/").replace(/^\.?\//, "");
}

function globToRegExp(pattern: string) {
	const escaped = pattern
		.replace(/[.+^${}()|[\]\\]/g, "\\$&")
		.replaceAll("*", ".*");

	return new RegExp(`^${escaped}$`);
}

export { loadSctIgnore, shouldIgnorePath };
