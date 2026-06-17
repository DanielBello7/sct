# Software Construction Tree

Software Construction Tree, or SCT, is a planning artifact for describing the
shape of a software project before or during implementation.

Most software projects eventually become a collection of folders and files. The
folder structure communicates architecture, boundaries, ownership, conventions,
and development intent. SCT makes that structure explicit in a dedicated `.sct`
document that can be read by humans, rendered as a preview, and used by tools.

## Why SCT Exists

Software teams often move from idea to code too quickly. The impact of weak
upfront structure is not always immediate, so project organization is often
decided while files are being created. That works for small experiments, but it
can create confusion as the project grows.

SCT introduces a missing design step: the construction tree.

Before writing the actual application code, a team can describe the intended
project structure:

- which folders should exist
- which files belong in those folders
- what framework or language the project targets
- what architectural pattern the project follows
- what parts are already planned, generated, or still pending

The goal is not to replace architecture documents, tickets, diagrams, or code.
The goal is to give the project structure its own durable artifact.

## The Artifact

An SCT document uses the `.sct` extension.

```sct
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
description             = "A planned project structure."

root Project {
  file .gitignore
  folder src {
    file index.ts
  }
}
```

The source document is intentionally plain text. It should be easy to read,
easy to diff, easy to generate, and easy for tools to parse.

## Presentation Mode

Every SCT document has two useful representations.

The first is the editable source representation:

```sct
root Project {
  folder src {
    file index.ts
  }
}
```

The second is a rendered presentation view:

```text
Project
└─ src
   └─ index.ts
```

The CLI currently supports terminal rendering and HTML rendering:

```bash
sct render
sct render --html
```

The HTML renderer follows the same idea as a Markdown preview. The `.sct` source
is parsed, transformed, and displayed as a richer visual document.

## What SCT Helps With

SCT is useful when a project structure needs to be shared, reviewed, generated,
or kept consistent.

It can help teams by:

- making the project shape visible before implementation begins
- reducing ambiguity around folder and file conventions
- giving new engineers a fast overview of a codebase
- helping non-engineers follow technical progress at a structural level
- providing AI coding agents with clear project intent and placement rules
- keeping generated templates and manual structure changes in one artifact
- making structure reviews possible before code reviews

## Current Scope

The current version focuses on:

- creating `.sct` files
- storing project metadata
- describing folders and files
- adding files and folders through the CLI
- removing files and folders from the tree
- rendering a terminal preview
- rendering an HTML preview
- supporting starter templates for selected language/framework pairs

Supported language and framework options will grow over time. The format is
intended to support many software ecosystems, including TypeScript, JavaScript,
C#, Rust, C++, Python, Go, Java, and others.

## CLI Shape

The CLI is named `sct`.

Common commands:

```bash
sct init
sct init -y
sct add file users.controller.ts src/modules/users
sct add folder users src/modules
sct add users.controller.ts src/modules/users
sct add folder -c users posts comments -d src/modules
sct rm users.controller.ts
sct render
sct render --html
```

The shorthand `sct add <name> <location>` assumes the entry is a file.

## Design Goals

SCT should be:

1. Human-readable
2. AI-readable
3. Easy to parse
4. Easy to generate
5. Language-agnostic
6. Framework-aware
7. Git-friendly
8. Deterministic
9. Scalable to large projects
10. Presentation-friendly

## Future Direction

Future versions may introduce additional structural concepts:

- modules
- imports
- templates
- dependencies
- owners
- tags
- descriptions for individual files or folders
- generation targets
- validation rules
- project-to-SCT reverse parsing

These features should be added carefully. The core language should remain small,
predictable, and readable.
