import { file, folder } from "../../utils.js";
export function typescriptReactTemplate(projectName) {
    return folder(projectName, [
        file("pnpm-lock.yaml"),
        file("package.json"),
        file(".gitignore"),
        folder("src", [file("index.d.ts"), file("App.ts")]),
    ]);
}
//# sourceMappingURL=index.js.map