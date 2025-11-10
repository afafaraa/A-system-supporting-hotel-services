# API Documentation Generator

This directory contains scripts and tools for generating API documentation from OpenAPI specification files.

## Prerequisites

- Node.js and npm installed
- Bash shell (Linux, macOS, or Git Bash/WSL on Windows)

## Directory Structure

- `openapi/` - Contains OpenAPI specification files (`.yml` or `.yaml`)
- `api_docs/` - Generated HTML documentation files (auto-created)
- `generate_docs.sh` - Script to generate documentation

## Usage

### 1. Add OpenAPI Specifications

Place your OpenAPI specification files (`.yml` or `.yaml`) in the `openapi/` directory.

### 2. Generate Documentation

Run the generation script:

```bash
./generate_docs.sh
```

Or if you need to make it executable first:

```bash
chmod +x generate_docs.sh
./generate_docs.sh
```

### 3. View Generated Documentation

The script will generate HTML documentation files in the `api_docs/` directory. Each `.yml`/`.yaml` file will have a corresponding `.html` file.

Open the generated HTML files in your browser:

```bash
# Example
open api_docs/your-api.html
```

## Example

```bash
# Add your OpenAPI spec
cp my-api.yml openapi/

# Generate docs
./generate_docs.sh

# Output:
# Generating docs for: openapi/my-api.yml -> api_docs/my-api.html
# All API documentation generated successfully!
```

