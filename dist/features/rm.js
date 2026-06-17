import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "../constants/index.js";
import { formatSctAst } from "../libs/formatter.js";
import { findSctPath } from "../libs/paths.js";
import { parseSct } from "../libs/sct.js";
import { findFolder } from "../libs/tree-paths.js";
import fs from "fs-extra";
import pc from "picocolors";
function removeByName(parent, name) {
    let removed = 0;
    const remainingChildren = [];
    for (const child of parent.children) {
        if (child.name === name) {
            removed += 1;
            continue;
        }
        if (child.type === "folder") {
            removed += removeByName(child, name);
        }
        remainingChildren.push(child);
    }
    parent.children = remainingChildren;
    return removed;
}
function removeDirectChild(parent, name) {
    const before = parent.children.length;
    parent.children = parent.children.filter((child) => child.name !== name);
    return before - parent.children.length;
}
function removeFromLocation(root, name, location) {
    const folder = findFolder(root, location);
    if (!folder) {
        return 0;
    }
    return removeDirectChild(folder, name);
}
async function rm(name, location) {
    intro(pc.bold("sct rm"));
    let outputPath;
    try {
        outputPath = await findSctPath();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Could not locate .sct file.";
        cancel(message);
        process.exit(1);
    }
    if (!outputPath) {
        console.error(pc.red(`No .sct file found in ${OUTPUT_DIR}/. Run \`sct init\` first.`));
        process.exit(1);
    }
    const source = await fs.readFile(outputPath, "utf8");
    let parsed;
    try {
        parsed = parseSct(source);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Invalid .sct file.";
        cancel(message);
        process.exit(1);
    }
    const removed = location
        ? removeFromLocation(parsed.root, name, location)
        : removeByName(parsed.root, name);
    if (removed === 0) {
        outro(pc.yellow(`No entries named ${name} found.`));
        return;
    }
    await fs.writeFile(outputPath, formatSctAst(parsed), "utf8");
    outro(pc.green(`Removed ${removed} entr${removed === 1 ? "y" : "ies"} named ${name}`));
}
export { rm };
//# sourceMappingURL=rm.js.map