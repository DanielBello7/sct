import { join, resolve } from "node:path";
import { OUTPUT_DIR } from "../constants/index.js";
import fs from "fs-extra";
function sctreePathForProject(projectName) {
    return resolve(process.cwd(), OUTPUT_DIR, `${projectName}.sctree`);
}
async function findSctreePath() {
    const outputDir = resolve(process.cwd(), OUTPUT_DIR);
    if (!(await fs.pathExists(outputDir))) {
        return undefined;
    }
    const entries = await fs.readdir(outputDir);
    const sctreeFiles = entries.filter((entry) => entry.endsWith(".sctree"));
    if (sctreeFiles.length === 0) {
        return undefined;
    }
    if (sctreeFiles.length > 1) {
        throw new Error(`Multiple .sctree files found in ${outputDir}. Keep one active project file for now.`);
    }
    return join(outputDir, sctreeFiles[0]);
}
function displaySctreePath(projectName) {
    return `${OUTPUT_DIR}/${projectName}.sctree`;
}
export { displaySctreePath, findSctreePath, sctreePathForProject };
//# sourceMappingURL=paths.js.map