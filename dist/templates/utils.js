export function file(name) {
    return { type: "file", name, children: [] };
}
export function folder(name, children = []) {
    return { type: "folder", name, children };
}
//# sourceMappingURL=utils.js.map