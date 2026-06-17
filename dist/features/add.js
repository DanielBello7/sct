import { formatSctreeAst } from "../libs/formatter.js";
import { parseSctree } from "../libs/sctree.js";
import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "../constants/index.js";
import { loadSctConfig } from "../libs/config.js";
import { findSctreePath } from "../libs/paths.js";
import { findOrCreateFolder, locationParts } from "../libs/tree-paths.js";
import fs from "fs-extra";
import { join } from "node:path";
import pc from "picocolors";
export async function add(name, location, kind = "file") {
    await addMany([name], location, kind);
}
export async function addMany(names, location, kind = "file") {
    intro(pc.bold("sctree add"));
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
    const parts = locationParts(location, parsed.root.name);
    let current = parsed.root;
    for (const part of parts) {
        current = findOrCreateFolder(current, part);
    }
    const added = [];
    const skipped = [];
    for (const name of names) {
        const existingEntry = current.children.find((child) => child.name === name);
        if (existingEntry) {
            skipped.push(name);
            continue;
        }
        current.children.push({ type: kind, name, children: [] });
        added.push(name);
    }
    if (added.length === 0) {
        outro(pc.yellow(`No entries added. Already exists: ${skipped.join(", ")}`));
        return;
    }
    await fs.writeFile(outputPath, formatSctreeAst(parsed), "utf8");
    await applyFilesystemAdd({
        added,
        kind,
        locationParts: parts,
    });
    const skippedMessage = skipped.length > 0 ? pc.yellow(` Skipped: ${skipped.join(", ")}`) : "";
    outro(pc.green(`Added ${added.length} ${kind}${added.length === 1 ? "" : "s"} to ${location}.`) + skippedMessage);
}
async function applyFilesystemAdd(options) {
    const config = await loadSctConfig();
    if (!config.filesystem.applyOnAdd) {
        return;
    }
    const destination = join(process.cwd(), ...options.locationParts);
    await fs.ensureDir(destination);
    for (const name of options.added) {
        const path = join(destination, name);
        if (options.kind === "folder") {
            await fs.ensureDir(path);
            continue;
        }
        await fs.ensureFile(path);
    }
}
//# sourceMappingURL=add.js.map