#!/usr/bin/env bash
# Antigravity & Cursor hook: PreToolUse / beforeShellExecution — quality gates before git commit
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    cmd = (
        d.get('toolCall', {}).get('args', {}).get('CommandLine', '') or
        d.get('command', '') or
        d.get('tool_input', {}).get('command', '')
    )
    print(cmd)
except Exception:
    print('')
")

if ! echo "$COMMAND" | grep -q "git commit"; then
  echo '{"decision":"allow","permission":"allow"}'
  exit 0
fi

# --- Verify commit-msg hook ---
if [ -x ".git/hooks/commit-msg" ]; then
  echo "OK: .git/hooks/commit-msg instalado" >&2
elif [ -f "scripts/git-hooks/commit-msg" ]; then
  echo "AVISO: falta instalar hooks. Ejecuta: ./scripts/setup-hooks.sh" >&2
else
  echo "AVISO: no se encontró scripts/git-hooks/commit-msg" >&2
fi

# --- Lint ---
echo "Ejecutando linter antes del commit..." >&2
if [ -f "package.json" ]; then
  npx eslint . --max-warnings=0 2>&1 || npx biome check . 2>&1 || true
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  python -m ruff check . 2>&1 || python -m flake8 . 2>&1 || true
elif ls *.csproj >/dev/null 2>&1; then
  dotnet format --verify-no-changes 2>&1 || true
elif [ -f "pubspec.yaml" ]; then
  dart analyze 2>&1 || true
else
  echo "Sin linter detectado; omitiendo." >&2
fi

# --- Tests ---
echo "Ejecutando tests antes del commit..." >&2
TEST_OK=1
if [ -f "package.json" ]; then
  npm test -- --run 2>&1 || npm test 2>&1 || TEST_OK=0
elif [ -f "pom.xml" ]; then
  mvn test -q 2>&1 || TEST_OK=0
elif [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
  ./gradlew test 2>&1 || TEST_OK=0
elif ls *.csproj >/dev/null 2>&1; then
  dotnet test 2>&1 || TEST_OK=0
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  python -m pytest --tb=short -q 2>&1 || TEST_OK=0
elif [ -f "pubspec.yaml" ]; then
  flutter test 2>&1 || TEST_OK=0
else
  echo "No se detectó framework de tests; omitiendo." >&2
fi

# --- Coverage (best-effort) ---
echo "Verificando cobertura..." >&2
if [ -f "package.json" ]; then
  npx jest --coverage --coverageReporters=text-summary --passWithNoTests 2>&1 || npx vitest --run --coverage 2>&1 || true
elif [ -f "pom.xml" ]; then
  mvn -q jacoco:report 2>&1 || true
elif [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
  ./gradlew jacocoTestReport 2>&1 || true
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  python -m pytest --cov --cov-report=term-missing -q 2>&1 || true
elif [ -f "pubspec.yaml" ]; then
  flutter test --coverage 2>&1 || true
else
  echo "Sin herramienta de cobertura; omitiendo." >&2
fi

if [ "$TEST_OK" -eq 0 ]; then
  echo '{"decision":"deny","permission":"deny","reason":"Pre-commit gate: los tests fallaron. Corrige los errores antes de hacer commit.","user_message":"Los tests fallaron antes del commit. Corrige los errores e intenta de nuevo."}'
  exit 0
fi

echo '{"decision":"allow","permission":"allow"}'
exit 0
