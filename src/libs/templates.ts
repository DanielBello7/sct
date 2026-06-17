import type { TreeNode } from "./sct";
import { basicTemplate } from "@/templates/basic";
import { javascriptNodeTemplate } from "@/templates/javascript/node/index";
import { javascriptReactTemplate } from "@/templates/javascript/react/index";
import { typescriptNodeTemplate } from "@/templates/typescript/node/index";
import { typescriptReactTemplate } from "@/templates/typescript/react/index";

type TemplateMetadata = {
	name: string;
	language: string;
	framework: string;
};

function templateForMetadata(metadata: TemplateMetadata): TreeNode {
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
	return basicTemplate(metadata.name);
}

export { templateForMetadata };
