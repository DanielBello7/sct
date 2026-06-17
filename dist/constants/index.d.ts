import type { MetadataKey } from "../types";
declare const DEFAULT_PROJECT_NAME = "Project";
declare const DEFAULT_PROJECT_TYPE = "none";
declare const DEFAULT_LANGUAGE = "typescript";
declare const DEFAULT_FRAMEWORK = "none";
declare const DEFAULT_VERSION = "0.1.0";
declare const METADATA_KEY_WIDTH = 24;
declare const OUTPUT_DIR = ".out";
declare const DEFAULT_IGNORE_PATTERNS: string[];
declare const METADATA_ORDER: MetadataKey[];
declare const PROJECT_TYPE_OPTIONS: readonly [{
    readonly value: "none";
    readonly label: "None";
}, {
    readonly value: "application";
    readonly label: "Application";
}, {
    readonly value: "library";
    readonly label: "Library";
}, {
    readonly value: "service";
    readonly label: "Service";
}, {
    readonly value: "tool";
    readonly label: "Tool";
}];
declare const LANGUAGE_OPTIONS: readonly [{
    readonly value: "typescript";
    readonly label: "TypeScript";
}, {
    readonly value: "javascript";
    readonly label: "JavaScript";
}, {
    readonly value: "csharp";
    readonly label: "C#";
}];
declare const LANGUAGE_FRAMEWORK_OPTIONS: readonly [{
    readonly language: "typescript";
    readonly frameworks: readonly [{
        readonly value: "none";
        readonly label: "None";
    }, {
        readonly value: "node";
        readonly label: "Node.js";
    }, {
        readonly value: "express";
        readonly label: "Express";
    }, {
        readonly value: "nestjs";
        readonly label: "NestJS";
    }, {
        readonly value: "react";
        readonly label: "React";
    }];
}, {
    readonly language: "javascript";
    readonly frameworks: readonly [{
        readonly value: "none";
        readonly label: "None";
    }, {
        readonly value: "node";
        readonly label: "Node.js";
    }, {
        readonly value: "express";
        readonly label: "Express";
    }, {
        readonly value: "react";
        readonly label: "React";
    }];
}, {
    readonly language: "csharp";
    readonly frameworks: readonly [{
        readonly value: "none";
        readonly label: "None";
    }, {
        readonly value: "aspnet-core";
        readonly label: "ASP.NET Core";
    }];
}];
export { DEFAULT_PROJECT_NAME, DEFAULT_PROJECT_TYPE, DEFAULT_LANGUAGE, DEFAULT_FRAMEWORK, DEFAULT_VERSION, METADATA_KEY_WIDTH, PROJECT_TYPE_OPTIONS, LANGUAGE_OPTIONS, LANGUAGE_FRAMEWORK_OPTIONS, OUTPUT_DIR, METADATA_ORDER, DEFAULT_IGNORE_PATTERNS, };
//# sourceMappingURL=index.d.ts.map