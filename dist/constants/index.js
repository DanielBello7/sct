const DEFAULT_PROJECT_NAME = "Project";
const DEFAULT_PROJECT_TYPE = "none";
const DEFAULT_LANGUAGE = "typescript";
const DEFAULT_FRAMEWORK = "none";
const DEFAULT_VERSION = "0.1.0";
const METADATA_KEY_WIDTH = 24;
const OUTPUT_DIR = ".out";
const METADATA_ORDER = [
    "name",
    "type",
    "language",
    "framework",
    "version",
    "author",
    "description",
];
const PROJECT_TYPE_OPTIONS = [
    { value: "none", label: "None" },
    { value: "application", label: "Application" },
    { value: "library", label: "Library" },
    { value: "service", label: "Service" },
    { value: "tool", label: "Tool" },
];
const LANGUAGE_OPTIONS = [
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "csharp", label: "C#" },
];
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
    {
        language: "csharp",
        frameworks: [
            { value: "none", label: "None" },
            { value: "aspnet-core", label: "ASP.NET Core" },
        ],
    },
];
export { DEFAULT_PROJECT_NAME, DEFAULT_PROJECT_TYPE, DEFAULT_LANGUAGE, DEFAULT_FRAMEWORK, DEFAULT_VERSION, METADATA_KEY_WIDTH, PROJECT_TYPE_OPTIONS, LANGUAGE_OPTIONS, LANGUAGE_FRAMEWORK_OPTIONS, OUTPUT_DIR, METADATA_ORDER, };
//# sourceMappingURL=index.js.map