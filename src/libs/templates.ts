import type { TreeNode } from "./sctree.ts";
import { basicTemplate } from "@/templates/basic.ts";
import { javascriptNodeTemplate } from "@/templates/javascript/node/index.ts";
import { javascriptReactTemplate } from "@/templates/javascript/react/index.ts";
import { typescriptNodeTemplate } from "@/templates/typescript/node/index.ts";
import { typescriptReactTemplate } from "@/templates/typescript/react/index.ts";

type TemplateMetadata = {
	name: string;
	language: string;
	framework: string;
};

export function templateForMetadata(metadata: TemplateMetadata): TreeNode {
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
