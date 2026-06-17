import { file, folder } from "../../utils.js";
export function typescriptNodeTemplate(projectName) {
    return folder(projectName, [
        file("package.json"),
        file(".gitignore"),
        folder("src", [file("index.ts")]),
    ]);
}
//# sourceMappingURL=index.js.map