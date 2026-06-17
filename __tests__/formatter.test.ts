import { expect } from "chai";
import { formatSctreeAst, formatSctDocument } from "../src/libs/formatter";
import { parseSctree } from "../src/libs/sctree";
import { renderTxt } from "../src/libs/render-txt";

describe("formatter", () => {
	it("formats metadata and tree deterministically", () => {
		const source = formatSctDocument(
			{
				name: "Project",
				type: "none",
				language: "typescript",
				framework: "none",
				version: "0.1.0",
				description: "A test project",
			},
			{
				type: "folder",
				name: "Project",
				children: [
					{ type: "folder", name: "src", children: [] },
					{ type: "file", name: "package.json", children: [] },
					{ type: "file", name: ".gitignore", children: [] },
				],
			},
		);

		expect(source).to.match(/name\s+= "Project"/);
		expect(source).to.match(/description\s+= "A test project"/);
		expect(source).to.match(
			/root Project \{\n  file \.gitignore\n  file package\.json\n  folder src \{/,
		);
	});

	it("parses and re-formats SCT source", () => {
		const ast = parseSctree(`name = "Project"
type = "none"
language = "typescript"
framework = "none"
version = "0.1.0"

root Project {
  folder src {
    file index.ts
  }
}
`);

		expect(ast.root.name).to.equal("Project");
		expect(formatSctreeAst(ast)).to.include("file index.ts");
	});

	it("renders text preview", () => {
		const ast = parseSctree(`name = "Project"
type = "none"
language = "typescript"
framework = "none"
version = "0.1.0"

root Project {
  folder src {
    file index.ts
  }
}
`);

		expect(renderTxt(ast)).to.equal("Project\n└─ src\n   └─ index.ts\n");
	});
});
