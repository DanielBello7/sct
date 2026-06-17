import type { SctAst, TreeNode } from "@/libs/sct";

function renderHtml(ast: SctAst) {
	const title = ast.root.name;
	const metadata = parseMetadata(ast.metadataLines);
	const description = metadata.find(
		(entry) => entry.key === "description",
	)?.value;

	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} SCT Preview</title>
  <style>
    :root {
      color-scheme: light dark;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f7f7f4;
      color: #202124;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: #f7f7f4;
    }

    main {
      width: min(960px, calc(100% - 32px));
      margin: 0 auto;
      padding: 40px 0;
    }

    header {
      border-bottom: 1px solid #d8d8d2;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0 0 10px;
      font-size: 32px;
      line-height: 1.1;
      font-weight: 720;
    }

    .description {
      max-width: 720px;
      margin: 0 0 20px;
      color: #4b4f52;
      font-size: 15px;
      line-height: 1.6;
    }

    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 8px 20px;
      margin: 0;
      font-size: 14px;
    }

    dt {
      color: #5f6368;
      font-weight: 650;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0;
    }

    dd {
      margin: 0;
    }

    .tree {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      font-size: 14px;
      line-height: 1.7;
      background: #ffffff;
      border: 1px solid #deded8;
      border-radius: 8px;
      padding: 20px;
      overflow: auto;
    }

    .tree ul {
      list-style: none;
      margin: 0;
      padding-left: 22px;
      border-left: 1px solid #d8d8d2;
    }

    .tree > ul {
      padding-left: 0;
      border-left: 0;
    }

    .tree li {
      margin: 2px 0;
      position: relative;
    }

    .tree li::before {
      content: "";
      position: absolute;
      left: -22px;
      top: 0.85em;
      width: 14px;
      border-top: 1px solid #d8d8d2;
    }

    .tree > ul > li::before {
      display: none;
    }

    .node {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 22px;
      white-space: nowrap;
    }

    .icon {
      width: 18px;
      text-align: center;
    }

    .folder {
      font-weight: 650;
      color: #174ea6;
    }

    .file {
      color: #2f3133;
    }

    @media (prefers-color-scheme: dark) {
      :root,
      body {
        background: #171817;
        color: #f1f3f4;
      }

      header,
      .tree,
      .tree ul,
      .tree li::before {
        border-color: #3b3d3a;
      }

      .tree {
        background: #202124;
      }

      dt {
        color: #bdc1c6;
      }

      .description {
        color: #c9cccf;
      }

      .folder {
        color: #8ab4f8;
      }

      .file {
        color: #e8eaed;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(title)}</h1>
      ${renderDescription(description)}
      ${renderMetadata(metadata)}
    </header>
    <section class="tree" aria-label="Project tree">
      ${renderTreeHtml(ast.root)}
    </section>
  </main>
</body>
</html>
`;
}

type MetadataEntry = {
	key: string;
	value: string;
};

function renderDescription(description: string | undefined) {
	if (!description) {
		return "";
	}

	return `<p class="description">${escapeHtml(description)}</p>`;
}

function renderMetadata(rows: MetadataEntry[]) {
	const metadataRows = rows.filter((entry) => entry.key !== "description");

	if (metadataRows.length === 0) {
		return "";
	}

	return `<dl>
${metadataRows
	.map(
		(row) =>
			`        <dt>${escapeHtml(row.key)}</dt><dd>${escapeHtml(row.value)}</dd>`,
	)
	.join("\n")}
      </dl>`;
}

function parseMetadata(lines: string[]) {
	return lines
		.map(parseMetadataLine)
		.filter((entry): entry is MetadataEntry => Boolean(entry));
}

function parseMetadataLine(line: string) {
	const match = line.match(/^([a-z]+)\s*=\s*(.+)$/);

	if (!match) {
		return undefined;
	}

	return {
		key: match[1] ?? "",
		value: normalizeMetadataValue(match[2] ?? ""),
	};
}

function normalizeMetadataValue(value: string) {
	const trimmed = value.trim();

	if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
		try {
			const parsed = JSON.parse(trimmed);
			return typeof parsed === "string" ? parsed : String(parsed);
		} catch {
			return trimmed.slice(1, -1);
		}
	}

	return trimmed;
}

function renderTreeHtml(root: TreeNode) {
	return `<ul>
${renderNode(root, 1)}
      </ul>`;
}

function renderNode(node: TreeNode, depth: number): string {
	const indent = "  ".repeat(depth + 3);
	const icon = node.type === "folder" ? "[D]" : "[F]";
	const children =
		node.type === "folder" && node.children.length > 0
			? `\n${indent}  <ul>\n${node.children
					.map((child) => renderNode(child, depth + 1))
					.join("\n")}\n${indent}  </ul>`
			: "";

	return `${indent}<li><span class="node ${node.type}"><span class="icon">${icon}</span>${escapeHtml(node.name)}</span>${children}</li>`;
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export { renderHtml };
