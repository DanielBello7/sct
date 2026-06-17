import { pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, statSync } from "node:fs";

const rootDir = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

export function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith("@/")) {
		return nextResolve(toTsUrl(resolvePath(rootDir, "src", specifier.slice(2))), context);
	}

	if (specifier.startsWith(".") && context.parentURL) {
		return nextResolve(
			toTsUrl(resolvePath(dirname(fileURLToPath(context.parentURL)), specifier)),
			context,
		);
	}

	return nextResolve(specifier, context);
}

function toTsUrl(path) {
	if (existsSync(path) && statSync(path).isFile()) {
		return pathToFileURL(path).href;
	}

	if (existsSync(`${path}.ts`)) {
		return pathToFileURL(`${path}.ts`).href;
	}

	if (existsSync(`${path}/index.ts`)) {
		return pathToFileURL(`${path}/index.ts`).href;
	}

	return pathToFileURL(path).href;
}
