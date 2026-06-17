#### SCT v1 Specification

Language Name:
Software Construction Tree (SCT)

File Extension:
.sct

<!-- prettier-ignore-start -->
Reserved Keywords;
01. name
02. type
03. language
04. framework
05. version
06. author
07. root
08. file
09. folder
10. description

Project metadata keywords;
01. name
02. type
03. language
04. framework
05. version
06. author
07. description

Project structure keywords;
01. root
02. file
03. folder

Identifiers
Folder names may contain:
- letters
- numbers
- underscores
- hyphens
- periods

File names may contain:
- any valid filesystem filename

Keywords cannot be used as identifiers.

Below is an example document for a simple blog application
written in typescript, using expressjs

`project.sct`
name            = "project"
type            = "nodejs"
language        = "typescript"
framework       = "express"


root Project {
  file .gitignore
  file .mocharc.json
  file .gitkeep
  file .env
  file .env.example
  file Dockerfile
  file dockerignore
  file README.md
  file package.json
  file tsconfig.json
  file pnpm-lock.yaml
  file prettier.config.mjs

  folder logs {
    file error.log
    file exceptions.log
    file info.log
  }
  folder test {
    file .gitkeep
    folder libs {
      file .gitkeep
      file pg-db.ts
      file pg-db-test.ts
      file request.ts
    }
    folder modules  {
      file health.spec.ts
      folder budgets {
        file controller.spec.ts
        file service.spec.ts
      }
    }
  }
  folder src {
    file app.ts
    file index.d.ts
    file server.ts
    folder modules {
      file index.ts
      folder budget {
        file budget.controllers.ts
        file budget.exceptions.ts
        file budget.router.ts
        file budget.services.ts
        folder dto {
          file create-budget.dto.ts
          file find-budget-by-id.dto.ts
          file find-budgets.dto.ts
          file index.ts
          file insert-budget.dto.ts
          file update-budget.dto.ts
        }
      }
      folder health {
        file health.controller.ts
        file health.service.ts
        file health.router.ts
      }
    }
    folder types {
      file budget.types.ts
      file index.ts
    }
    folder libs {
      file is-valid-dto.ts
      file validate.ts
      folder exceptions {
        file bad-request.ts
        file not-found.ts
      }
    }
    folder db {
      file drizzle.config.ts
      file index.ts
      folder drizzle {
        file temp.sql
        folder meta {
          file snapshot.json
          file _journal.json
        }
      }
      folder schemas {
        file budgets.schema.ts
        file common.ts
        file index.ts
      }
    }
    folder constants {
      file envs.ts
      file index.ts
    }
  }
}


#### Rules
01. All file documents are prefixed with the keyword "file".
02. All folder documents are prefixed with the keyword "folder".
03. All documents within a folder are enclosed within the  {}" braces.
04. All files are ordered first alphabetically
05. All folders are ordered second alphabetically.
06. Nested content recursively follows the same rule.
07. There is only one root folder in every document.
08. "Root" keyword is used to show what the root folder is.
09. Lines beginning with # are comments.
10. Comments are ignored by the parser.

#### Parser Guarantees
01. A document must contain exactly one root declaration.
02. Root declarations cannot be nested.
03. Files cannot contain child nodes.
04. Folders may contain files and folders.
05. Circular imports are not allowed.
06. Unknown keywords result in parser errors.
07. Documents are parsed top-to-bottom.

<!-- prettier-ignore-end -->
