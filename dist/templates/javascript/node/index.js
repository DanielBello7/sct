import { file, folder } from "../../utils.js";
export function javascriptNodeTemplate(projectName) {
    return folder(projectName, [
        file("package.json"),
        file(".gitignore"),
        folder("src", [file("index.js")]),
    ]);
}
//# sourceMappingURL=index.js.map