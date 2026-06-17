import { join, resolve } from "node:path";
import { OUTPUT_DIR } from "../constants/index.js";
import fs from "fs-extra";
function sctPathForProject(projectName) {
    return resolve(process.cwd(), OUTPUT_DIR, `${projectName}.sct`);
}
async function findSctPath() {
    const outputDir = resolve(process.cwd(), OUTPUT_DIR);
    if (!(await fs.pathExists(outputDir))) {
        return undefined;
    }
    const entries = await fs.readdir(outputDir);
    const sctFiles = entries.filter((entry) => entry.endsWith(".sct"));
    if (sctFiles.length === 0) {
        return undefined;
    }
    if (sctFiles.length > 1) {
        throw new Error(`Multiple .sct files found in ${outputDir}. Keep one active project file for now.`);
    }
    return join(outputDir, sctFiles[0]);
}
function displaySctPath(projectName) {
    return `${OUTPUT_DIR}/${projectName}.sct`;
}
export { displaySctPath, findSctPath, sctPathForProject };
//# sourceMappingURL=paths.js.map