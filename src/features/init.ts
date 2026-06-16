import { cancel, intro, isCancel, outro, select, text } from "@clack/prompts";
import { displaySctreePath, sctreePathForProject } from "@/libs/paths.ts";
import { serializeRoot } from "@/libs/sctree.ts";
import { templateForMetadata } from "@/libs/templates.ts";
import fs from "fs-extra";
import pc from "picocolors";

const DEFAULT_PROJECT_NAME = "TL";
const DEFAULT_PROJECT_TYPE = "application";
const DEFAULT_LANGUAGE = "typescript";
const DEFAULT_FRAMEWORK = "none";
const DEFAULT_VERSION = "0.1.0";
const METADATA_KEY_WIDTH = 12;

const PROJECT_TYPE_OPTIONS = [
	{ value: "application", label: "Application" },
	{ value: "library", label: "Library" },
	{ value: "service", label: "Service" },
	{ value: "tool", label: "Tool" },
] as const;

const LANGUAGE_OPTIONS = [
	{ value: "typescript", label: "TypeScript" },
	{ value: "javascript", label: "JavaScript" },
] as const;

const LANGUAGE_FRAMEWORK_OPTIONS = [
	{
		language: "typescript",
		frameworks: [
			{ value: "none", label: "None" },
			{ value: "node", label: "Node.js" },
			{ value: "express", label: "Express" },
			{ value: "nestjs", label: "NestJS" },
			{ value: "react", label: "React" },
		],
	},
	{
		language: "javascript",
		frameworks: [
			{ value: "none", label: "None" },
			{ value: "node", label: "Node.js" },
			{ value: "express", label: "Express" },
			{ value: "react", label: "React" },
		],
	},
] as const;

export type ProjectMetadata = {
	name: string;
	type: string;
	language: string;
	framework: string;
	version: string;
};

export type InitOptions = Partial<ProjectMetadata>;

function createStarterSctree(metadata: ProjectMetadata) {
	const root = templateForMetadata(metadata);

	return `${formatMetadataLine("name", metadata.name)}
${formatMetadataLine("type", metadata.type)}
${formatMetadataLine("language", metadata.language)}
${formatMetadataLine("framework", metadata.framework)}
${formatMetadataLine("version", metadata.version)}

${serializeRoot(root).join("\n")}
`;
}

function formatMetadataLine(key: keyof ProjectMetadata, value: string) {
	return `${key.padEnd(METADATA_KEY_WIDTH)}= ${value}`;
}

function frameworksForLanguage(language: string) {
	return (
		LANGUAGE_FRAMEWORK_OPTIONS.find((entry) => entry.language === language)
			?.frameworks ?? [{ value: DEFAULT_FRAMEWORK, label: "None" }]
	);
}

function isSupportedFramework(language: string, framework: string) {
	return frameworksForLanguage(language).some(
		(option) => option.value === framework,
	);
}

function getPromptValue<T>(value: T | symbol): T {
	if (isCancel(value)) {
		cancel("Initialization cancelled.");
		process.exit(0);
	}

	return value;
}

async function askMetadata(options: InitOptions) {
	intro(pc.bold("sctree init"));

	const name =
		options.name ??
		getPromptValue(
			await text({
				message: "Project name",
				placeholder: DEFAULT_PROJECT_NAME,
				defaultValue: DEFAULT_PROJECT_NAME,
			}),
		);

	const type =
		options.type ??
		getPromptValue(
			await select({
				message: "Project type",
				options: [...PROJECT_TYPE_OPTIONS],
				initialValue: DEFAULT_PROJECT_TYPE,
			}),
		);

	const language =
		options.language ??
		getPromptValue(
			await select({
				message: "Language",
				options: [...LANGUAGE_OPTIONS],
				initialValue: DEFAULT_LANGUAGE,
			}),
		);

	const framework =
		options.framework ??
		getPromptValue(
			await select({
				message: "Framework",
				options: [...frameworksForLanguage(language)],
				initialValue: DEFAULT_FRAMEWORK,
			}),
		);

	if (!isSupportedFramework(language, framework)) {
		cancel(`${framework} is not configured as a ${language} framework.`);
		process.exit(1);
	}

	const version =
		options.version ??
		getPromptValue(
			await text({
				message: "Version",
				placeholder: DEFAULT_VERSION,
				defaultValue: DEFAULT_VERSION,
			}),
		);

	return {
		name,
		type,
		language,
		framework,
		version,
	};
}

export async function init(options: InitOptions) {
	const metadata = await askMetadata(options);
	const outputPath = sctreePathForProject(metadata.name);
	const outputFile = displaySctreePath(metadata.name);

	if (await fs.pathExists(outputPath)) {
		const stats = await fs.stat(outputPath);

		if (stats.size > 0) {
			console.error(
				pc.red(`Refusing to overwrite existing file: ${outputPath}`),
			);
			process.exit(1);
		}
	}

	await fs.outputFile(outputPath, createStarterSctree(metadata), "utf8");
	outro(pc.green(`Initialized ${outputFile}`));
}
