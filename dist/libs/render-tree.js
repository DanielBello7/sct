export function renderTree(root) {
    return [root.name, ...renderChildren(root.children, "")].join("\n");
}
function renderChildren(children, prefix) {
    return children.flatMap((child, index) => {
        const isLast = index === children.length - 1;
        const connector = isLast ? "└─ " : "├─ ";
        const nextPrefix = `${prefix}${isLast ? "   " : "│  "}`;
        const line = `${prefix}${connector}${child.name}`;
        if (child.type === "file") {
            return [line];
        }
        return [line, ...renderChildren(child.children, nextPrefix)];
    });
}
//# sourceMappingURL=render-tree.js.map