import { cancel, intro, outro } from "@clack/prompts";
import { OUTPUT_DIR } from "../constants/index.js";
import { findSctreePath } from "../libs/paths.js";
import { renderHtml } from "../libs/render-html.js";
import { renderTree } from "../libs/render-tree.js";
import { renderTxt } from "../libs/render-txt.js";
import { parseSctree } from "../libs/sctree.js";
import fs from "fs-extra";
import { join } from "node:path";
import pc from "picocolors";
export async function render(options = {}) {
    intro(pc.bold("sctree render"));
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
    if (options.html && options.txt) {
        cancel("Choose one render output: --html or --txt.");
        process.exit(1);
    }
    if (options.html) {
        const htmlPath = join(process.cwd(), OUTPUT_DIR, `${parsed.root.name}.html`);
        await fs.outputFile(htmlPath, renderHtml(parsed), "utf8");
        outro(pc.green(`Rendered HTML preview to ${OUTPUT_DIR}/${parsed.root.name}.html`));
        return;
    }
    if (options.txt) {
        const txtPath = join(process.cwd(), OUTPUT_DIR, `${parsed.root.name}.txt`);
        await fs.outputFile(txtPath, renderTxt(parsed), "utf8");
        outro(pc.green(`Rendered text preview to ${OUTPUT_DIR}/${parsed.root.name}.txt`));
        return;
    }
    console.log(renderTree(parsed.root));
    outro(pc.green("Rendered tree"));
}
//# sourceMappingURL=render.js.map