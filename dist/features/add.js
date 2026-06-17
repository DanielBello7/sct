import { formatSctAst } from "../libs/formatter.js";
import { parseSct } from "../libs/sct.js";
import { cancel, intro, outro } from "@clack/prompts";
import { findSctPath } from "../libs/paths.js";
import { findOrCreateFolder, locationParts } from "../libs/tree-paths.js";
import fs from "fs-extra";
import pc from "picocolors";
export async function add(filename, location) {
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
        console.error(pc.red("No .sct file found in out/. Run `sct init` first."));
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
    const existingFile = current.children.find((child) => child.type === "file" && child.name === filename);
    if (existingFile) {
        outro(pc.yellow(`${filename} already exists in ${location}`));
        return;
    }
    current.children.push({ type: "file", name: filename, children: [] });
    await fs.writeFile(outputPath, formatSctAst(parsed), "utf8");
    outro(pc.green(`Added ${filename} to ${location}`));
}
//# sourceMappingURL=add.js.map