import { cancel, intro, isCancel, outro, select, text } from "@clack/prompts";
import { displaySctPath, sctPathForProject } from "@/libs/paths";
import { formatSctDocument } from "@/libs/formatter";
import { templateForMetadata } from "@/libs/templates";
import {
	DEFAULT_PROJECT_NAME,
	DEFAULT_PROJECT_TYPE,
	DEFAULT_LANGUAGE,
	DEFAULT_FRAMEWORK,
	DEFAULT_VERSION,
	PROJECT_TYPE_OPTIONS,
	LANGUAGE_OPTIONS,
	LANGUAGE_FRAMEWORK_OPTIONS,
} from "@/constants";
import fs from "fs-extra";
import pc from "picocolors";
import type { InitOptions, ProjectMetadata } from "@/types";

function createStarterSct(metadata: ProjectMetadata) {
	const root = templateForMetadata(metadata);
	return formatSctDocument(metadata, root);
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

async function askMetadata(options: InitOptions): Promise<ProjectMetadata> {
	intro(pc.bold("sct init"));

	if (options.yes) {
		const metadata = {
			name: options.name ?? DEFAULT_PROJECT_NAME,
			type: options.type ?? DEFAULT_PROJECT_TYPE,
			language: options.language ?? DEFAULT_LANGUAGE,
			framework: options.framework ?? DEFAULT_FRAMEWORK,
			version: options.version ?? DEFAULT_VERSION,
			author: options.author ?? "",
			description: options.description ?? "",
		};

		if (!isSupportedFramework(metadata.language, metadata.framework)) {
			cancel(
				`${metadata.framework} is not configured as a ${metadata.language} framework.`,
			);
			process.exit(1);
		}

		return metadata;
	}

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
		author: options.author ?? "",
		description: options.description ?? "",
	};
}

async function init(options: InitOptions) {
	const metadata = await askMetadata(options);
	const outputPath = sctPathForProject(metadata.name);
	const outputFile = displaySctPath(metadata.name);

	if (await fs.pathExists(outputPath)) {
		const stats = await fs.stat(outputPath);

		if (stats.size > 0) {
			console.error(
				pc.red(`Refusing to overwrite existing file: ${outputPath}`),
			);
			process.exit(1);
		}
	}

	await fs.outputFile(outputPath, createStarterSct(metadata), "utf8");
	outro(pc.green(`Initialized ${outputFile}`));
}

export { init };
