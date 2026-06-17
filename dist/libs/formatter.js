import { METADATA_ORDER, METADATA_KEY_WIDTH } from "../constants/index.js";
function formatMetadataLine(key, value) {
    return `${key.padEnd(METADATA_KEY_WIDTH)}= ${JSON.stringify(value)}`;
}
function formatMetadata(metadata) {
    return METADATA_ORDER.flatMap((key) => {
        const value = metadata[key];
        if (typeof value !== "string" || value.trim() === "") {
            return [];
        }
        return formatMetadataLine(key, value);
    });
}
function formatMetadataLines(lines) {
    const entries = new Map();
    for (const line of lines) {
        const match = line.match(/^(name|type|language|framework|version|author|description)\s*=\s*(.+)$/);
        if (!match) {
            continue;
        }
        const key = match[1];
        const value = normalizeMetadataValue(match[2] ?? "");
        entries.set(key, value);
    }
    return METADATA_ORDER.flatMap((key) => {
        const value = entries.get(key);
        return value ? formatMetadataLine(key, value) : [];
    });
}
function normalizeMetadataValue(value) {
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
            const parsed = JSON.parse(trimmed);
            return typeof parsed === "string" ? parsed : String(parsed);
        }
        catch {
            return trimmed.slice(1, -1);
        }
    }
    return trimmed;
}
function orderedChildren(children) {
    return [...children].sort((left, right) => {
        if (left.type !== right.type) {
            return left.type === "file" ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
    });
}
function formatNode(node, depth = 0) {
    const indent = "  ".repeat(depth);
    if (node.type === "file") {
        return [`${indent}file ${node.name}`];
    }
    return [
        `${indent}folder ${node.name} {`,
        ...orderedChildren(node.children).flatMap((child) => formatNode(child, depth + 1)),
        `${indent}}`,
    ];
}
function formatRoot(root) {
    return [
        `root ${root.name} {`,
        ...orderedChildren(root.children).flatMap((child) => formatNode(child, 1)),
        "}",
    ];
}
function formatSctDocument(metadata, root) {
    return `${formatMetadata(metadata).join("\n")}

${formatRoot(root).join("\n")}
`;
}
function formatSctreeAst(ast) {
    return `${formatMetadataLines(ast.metadataLines).join("\n")}\n\n${formatRoot(ast.root).join("\n")}\n`;
}
export { formatMetadata, formatMetadataLine, formatMetadataLines, formatNode, formatRoot, formatSctreeAst, formatSctDocument, };
//# sourceMappingURL=formatter.js.map