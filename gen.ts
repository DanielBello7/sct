import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const DEFAULT_OUTPUT_FILE = "project.sctree";
const DEFAULT_PROJECT_NAME = "TL";
const DEFAULT_PROJECT_TYPE = "application";
const DEFAULT_LANGUAGE = "typescript";
const DEFAULT_FRAMEWORK = "none";
const DEFAULT_VERSION = "0.1.0";
const LANGUAGE_OPTIONS = ["typescript", "javascript"] as const;
const FRAMEWORK_OPTIONS = [
	"none",
	"node",
	"express",
	"nestjs",
	"react",
	"nextjs",
	"vue",
	"svelte",
] as const;

const [, , command, ...args] = process.argv;

type ProjectMetadata = {
	name: string;
	type: string;
	language: string;
	framework: string;
	version: string;
};

type QuestionClient = ReturnType<typeof createInterface>;

function printHelp() {
	console.log(`sctree

Commands:
  generate [file]  Interactively create a starter .sctree file

Examples:
  sctree generate
  sctree generate api.sctree
  sctree generate --name TL --language typescript --framework express

Options:
  --name <name>            Project/root folder name
  --type <type>            Project type
  --language <language>    ${LANGUAGE_OPTIONS.join(", ")}
  --framework <framework>  ${FRAMEWORK_OPTIONS.join(", ")}
  --version <version>      Project version`);
}

function createStarterSctree(metadata: ProjectMetadata) {
	return `name ${metadata.name}
type ${metadata.type}
language ${metadata.language}
framework ${metadata.framework}
version ${metadata.version}

folder ${metadata.name} {
  file package.json
  file .gitignore
  folder src {
    folder modules {
      folder Users {
        file users.controller.ts
        file users.module.ts
      }
    }
  }
}
`;
}

async function askText(client: QuestionClient, label: string, fallback: string) {
	const answer = await client.question(`${label} (${fallback}): `);
	return answer.trim() || fallback;
}

async function askSelect(client: QuestionClient, label: string, options: readonly string[]) {
	console.log(`${label}:`);

	options.forEach((option, index) => {
		console.log(`  ${index + 1}. ${option}`);
	});

	while (true) {
		const answer = await client.question(`Choose 1-${options.length} (${options[0]}): `);
		const trimmed = answer.trim();

		if (!trimmed) {
			return options[0];
		}

		const selectedIndex = Number(trimmed) - 1;
		const selectedOption = options[selectedIndex];

		if (selectedOption) {
			return selectedOption;
		}

		const typedOption = options.find((option) => option === trimmed.toLowerCase());

		if (typedOption) {
			return typedOption;
		}

		console.log(`Please choose a number from 1-${options.length}.`);
	}
}

function readOption(args: string[], name: string, fallback: string) {
	const index = args.indexOf(`--${name}`);
	return index === -1 ? fallback : args[index + 1]?.trim() || fallback;
}

function hasOption(args: string[], name: string) {
	return args.includes(`--${name}`);
}

function parseGenerateArgs(args: string[]) {
	let outputFile = DEFAULT_OUTPUT_FILE;

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (arg?.startsWith("--")) {
			index += 1;
			continue;
		}

		outputFile = arg || DEFAULT_OUTPUT_FILE;
		break;
	}

	return {
		outputFile,
		metadata: {
			name: readOption(args, "name", DEFAULT_PROJECT_NAME),
			type: readOption(args, "type", DEFAULT_PROJECT_TYPE),
			language: readOption(args, "language", DEFAULT_LANGUAGE),
			framework: readOption(args, "framework", DEFAULT_FRAMEWORK),
			version: readOption(args, "version", DEFAULT_VERSION),
		},
	};
}

async function readMetadata(args: string[]) {
	const parsed = parseGenerateArgs(args);
	const hasAnyMetadataOption = ["name", "type", "language", "framework", "version"].some((name) =>
		hasOption(args, name),
	);

	if (hasAnyMetadataOption) {
		return parsed;
	}

	const client = createInterface({ input, output });

	try {
		const name = await askText(client, "Project name", DEFAULT_PROJECT_NAME);
		const language = await askSelect(client, "Language", LANGUAGE_OPTIONS);
		const framework = await askSelect(client, "Framework", FRAMEWORK_OPTIONS);
		const version = await askText(client, "Version", DEFAULT_VERSION);

		return {
			outputFile: parsed.outputFile,
			metadata: {
				name,
				type: DEFAULT_PROJECT_TYPE,
				language,
				framework,
				version,
			},
		};
	} finally {
		client.close();
	}
}

function generate(outputFile = DEFAULT_OUTPUT_FILE, metadata: ProjectMetadata) {
	const outputPath = resolve(process.cwd(), outputFile);

	if (existsSync(outputPath)) {
		console.error(`Refusing to overwrite existing file: ${outputPath}`);
		process.exit(1);
	}

	writeFileSync(outputPath, createStarterSctree(metadata), "utf8");
	console.log(`Generated ${outputFile}`);
}

switch (command) {
	case "generate":
		{
			const { outputFile, metadata } = await readMetadata(args);
			generate(outputFile, metadata);
		}
		break;
	case "-h":
	case "--help":
	case undefined:
		printHelp();
		break;
	default:
		console.error(`Unknown command: ${command}`);
		printHelp();
		process.exit(1);
}
