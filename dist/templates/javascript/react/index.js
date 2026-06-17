import { file, folder } from "../../utils.js";
export function javascriptReactTemplate(projectName) {
    return folder(projectName, [
        file("pnpm-lock.yaml"),
        file("package.json"),
        file(".gitignore"),
        folder("src", [file("App.js")]),
    ]);
}
//# sourceMappingURL=index.js.map