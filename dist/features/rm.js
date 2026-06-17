import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "../constants/index.js";
import { loadSctConfig } from "../libs/config.js";
import { formatSctreeAst } from "../libs/formatter.js";
import { findSctreePath } from "../libs/paths.js";
import { parseSctree } from "../libs/sctree.js";
import { findFolder, locationParts } from "../libs/tree-paths.js";
import fs from "fs-extra";
import { join } from "node:path";
import pc from "picocolors";
function removeByName(parent, name, pathParts = [], removedEntries = []) {
    let removed = 0;
    const remainingChildren = [];
    for (const child of parent.children) {
        if (child.name === name) {
            removed += 1;
            removedEntries.push({ pathParts: [...pathParts, child.name] });
            continue;
        }
        if (child.type === "folder") {
            removed += removeByName(child, name, [...pathParts, child.name], removedEntries);
        }
        remainingChildren.push(child);
    }
    parent.children = remainingChildren;
    return removed;
}
function removeDirectChild(parent, name, pathParts, removedEntries) {
    const before = parent.children.length;
    parent.children = parent.children.filter((child) => {
        if (child.name !== name) {
            return true;
        }
        removedEntries.push({ pathParts: [...pathParts, child.name] });
        return false;
    });
    return before - parent.children.length;
}
function removeFromLocation(root, name, location, removedEntries) {
    const folder = findFolder(root, location);
    if (!folder) {
        return 0;
    }
    return removeDirectChild(folder, name, locationParts(location, root.name), removedEntries);
}
async function rm(name, location) {
    intro(pc.bold("sctree rm"));
    let outputPath;
    try {
        outputPath = await findSctreePath();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Could not locate .sctree file.";
        cancel(message);
        process.exit(1);
    }
    if (!outputPath) {
        console.error(pc.red(`No .sctree file found in ${OUTPUT_DIR}/. Run \`sctree init\` first.`));
        process.exit(1);
    }
    const source = await fs.readFile(outputPath, "utf8");
    let parsed;
    try {
        parsed = parseSctree(source);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Invalid .sctree file.";
        cancel(message);
        process.exit(1);
    }
    const removedEntries = [];
    const removed = location
        ? removeFromLocation(parsed.root, name, location, removedEntries)
        : removeByName(parsed.root, name, [], removedEntries);
    if (removed === 0) {
        outro(pc.yellow(`No entries named ${name} found.`));
        return;
    }
    await fs.writeFile(outputPath, formatSctreeAst(parsed), "utf8");
    await applyFilesystemRemove(removedEntries);
    outro(pc.green(`Removed ${removed} entr${removed === 1 ? "y" : "ies"} named ${name}`));
}
async function applyFilesystemRemove(removedEntries) {
    const config = await loadSctConfig();
    if (!config.filesystem.applyOnRemove) {
        return;
    }
    for (const entry of removedEntries) {
        await fs.remove(join(process.cwd(), ...entry.pathParts));
    }
}
export { rm };
//# sourceMappingURL=rm.js.map