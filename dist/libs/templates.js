import { basicTemplate } from "../templates/basic.js";
import { csharpAspnetCoreTemplate } from "../templates/csharp/aspnet-core/index.js";
import { javascriptNodeTemplate } from "../templates/javascript/node/index.js";
import { javascriptReactTemplate } from "../templates/javascript/react/index.js";
import { typescriptNodeTemplate } from "../templates/typescript/node/index.js";
import { typescriptReactTemplate } from "../templates/typescript/react/index.js";
function templateForMetadata(metadata) {
    if (metadata.language === "typescript" && metadata.framework === "react") {
        return typescriptReactTemplate(metadata.name);
    }
    if (metadata.language === "javascript" && metadata.framework === "react") {
        return javascriptReactTemplate(metadata.name);
    }
    if (metadata.language === "typescript" && metadata.framework === "node") {
        return typescriptNodeTemplate(metadata.name);
    }
    if (metadata.language === "javascript" && metadata.framework === "node") {
        return javascriptNodeTemplate(metadata.name);
    }
    if (metadata.language === "csharp" && metadata.framework === "aspnet-core") {
        return csharpAspnetCoreTemplate(metadata.name);
    }
    return basicTemplate(metadata.name);
}
export { templateForMetadata };
//# sourceMappingURL=templates.js.map