import { expect } from "chai";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	defaultSctConfig,
	defaultSctIgnore,
	ensureProjectSupportFiles,
} from "../src/libs/project-files";

describe("project support files", () => {
	it("creates .sctreeignore and sctree.config.json", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "sct-support-"));
		const created = await ensureProjectSupportFiles(cwd);

		expect(created).to.deep.equal([".sctreeignore", "sctree.config.json"]);
		expect(await readFile(join(cwd, ".sctreeignore"), "utf8")).to.equal(
			defaultSctIgnore(),
		);
		expect(await readFile(join(cwd, "sctree.config.json"), "utf8")).to.equal(
			defaultSctConfig(),
		);
	});

	it("does not overwrite existing support files", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "sct-support-"));

		await writeFile(join(cwd, ".sctreeignore"), "custom-ignore\n");
		await writeFile(join(cwd, "sctree.config.json"), "{}\n");

		const created = await ensureProjectSupportFiles(cwd);

		expect(created).to.deep.equal([]);
		expect(await readFile(join(cwd, ".sctreeignore"), "utf8")).to.equal(
			"custom-ignore\n",
		);
		expect(await readFile(join(cwd, "sctree.config.json"), "utf8")).to.equal(
			"{}\n",
		);
	});
});
