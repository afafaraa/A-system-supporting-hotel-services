#!/bin/bash
INPUT_DIR="openapi"
OUTPUT_DIR="api_docs"

mkdir -p "$OUTPUT_DIR"

for file in "$INPUT_DIR"/*.yml "$INPUT_DIR"/*.yaml; do
  [ -e "$file" ] || continue
  name=$(basename "$file" .yaml)
  name=${name%.yml}
  echo "Generating docs for: $file -> $OUTPUT_DIR/$name.html"
  npx @redocly/cli build-docs "$file" -o "$OUTPUT_DIR/$name.html"
done

echo "All API documentation generated successfully!"
