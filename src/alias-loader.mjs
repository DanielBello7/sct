import { pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

export function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith("@/")) {
		return nextResolve(pathToFileURL(resolvePath(rootDir, "src", specifier.slice(2))).href, context);
	}

	return nextResolve(specifier, context);
}
