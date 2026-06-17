import { expect } from "chai";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mergeMissingNodes, scanProjectTree } from "../src/libs/scanner";
import type { TreeNode } from "../src/libs/sctree";

describe("scanner", () => {
	it("reads files and respects .sctreeignore", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "sct-scan-"));

		await mkdir(join(cwd, "src"), { recursive: true });
		await mkdir(join(cwd, "node_modules"), { recursive: true });
		await mkdir(join(cwd, "ignored"), { recursive: true });
		await writeFile(join(cwd, "src", "index.ts"), "");
		await writeFile(join(cwd, "node_modules", "left-pad.js"), "");
		await writeFile(join(cwd, "ignored", "skip.ts"), "");
		await writeFile(join(cwd, ".sctreeignore"), "ignored\n");

		const root = await scanProjectTree({ cwd, rootName: "Project" });

		expect(root.name).to.equal("Project");
		expect(
			root.children.some((child: TreeNode) => child.name === "src"),
		).to.equal(true);
		expect(
			root.children.some((child: TreeNode) => child.name === "node_modules"),
		).to.equal(false);
		expect(
			root.children.some((child: TreeNode) => child.name === "ignored"),
		).to.equal(false);
	});

	it("adds missing scanned entries", () => {
		const target: TreeNode = {
			type: "folder",
			name: "Project",
			children: [
				{
					type: "folder",
					name: "src",
					children: [{ type: "file", name: "index.ts", children: [] }],
				},
			],
		};

		const source: TreeNode = {
			type: "folder",
			name: "Project",
			children: [
				{
					type: "folder",
					name: "src",
					children: [
						{ type: "file", name: "index.ts", children: [] },
						{ type: "file", name: "app.ts", children: [] },
					],
				},
				{ type: "file", name: "README.md", children: [] },
			],
		};

		expect(mergeMissingNodes(target, source)).to.equal(2);
		expect(
			target.children.some((child: TreeNode) => child.name === "README.md"),
		).to.equal(true);
		expect(
			target.children
				.find((child: TreeNode) => child.name === "src")
				?.children.some((child: TreeNode) => child.name === "app.ts"),
		).to.equal(true);
	});
});
