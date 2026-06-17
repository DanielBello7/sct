import { formatSctAst } from "../libs/formatter.js";
import { parseSct } from "../libs/sct.js";
import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "../constants/index.js";
import { findSctPath } from "../libs/paths.js";
import { findOrCreateFolder, locationParts } from "../libs/tree-paths.js";
import fs from "fs-extra";
import pc from "picocolors";
export async function add(name, location, kind = "file") {
    await addMany([name], location, kind);
}
export async function addMany(names, location, kind = "file") {
    intro(pc.bold("sct add"));
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
    await fs.writeFile(outputPath, formatSctAst(parsed), "utf8");
    const skippedMessage = skipped.length > 0 ? pc.yellow(` Skipped: ${skipped.join(", ")}`) : "";
    outro(pc.green(`Added ${added.length} ${kind}${added.length === 1 ? "" : "s"} to ${location}.`) + skippedMessage);
}
//# sourceMappingURL=add.js.map