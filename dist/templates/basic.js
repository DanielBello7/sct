import { file, folder } from "./utils.js";
export function basicTemplate(projectName) {
    return folder(projectName, [file(".gitignore"), folder("src")]);
}
//# sourceMappingURL=basic.js.map