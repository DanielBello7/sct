import fs from "fs-extra";
import { resolve } from "node:path";

type SctConfig = {
	filesystem?: {
		applyOnAdd?: boolean;
		applyOnRemove?: boolean;
	};
};

const DEFAULT_CONFIG: Required<SctConfig> = {
	filesystem: {
		applyOnAdd: false,
		applyOnRemove: false,
	},
};

async function loadSctConfig(
	cwd = process.cwd(),
): Promise<Required<SctConfig>> {
	const configPath = resolve(cwd, "sctree.config.json");

	if (!(await fs.pathExists(configPath))) {
		return DEFAULT_CONFIG;
	}

	const raw = await fs.readJson(configPath);

	return {
		filesystem: {
			applyOnAdd: Boolean(raw.filesystem?.applyOnAdd),
			applyOnRemove: Boolean(raw.filesystem?.applyOnRemove),
		},
	};
}

export { DEFAULT_CONFIG, loadSctConfig };
export type { SctConfig };
