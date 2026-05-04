from __future__ import annotations

import json
import re
import subprocess
import tomllib
from pathlib import Path
from stat import S_IXUSR

REPO_ROOT = Path(__file__).resolve().parents[2]


def test_kubernetes_image_tags_track_project_version() -> None:
    project = tomllib.loads((REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    version = project["project"]["version"]
    deployment = (REPO_ROOT / "k8s" / "base" / "deployment.yaml").read_text(encoding="utf-8")

    image_tags = set(re.findall(r"image:\s*aci-platform:([^\s]+)", deployment))

    assert image_tags == {version}


def test_shared_backend_smoke_script_is_executable() -> None:
    script = REPO_ROOT / "scripts" / "smoke_stack.sh"

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert "docker compose -p" in script.read_text(encoding="utf-8")


def test_golden_demo_smoke_script_covers_presenter_critical_path() -> None:
    script = REPO_ROOT / "scripts" / "smoke_golden_demo.py"
    shell_smoke = (REPO_ROOT / "scripts" / "smoke_demo.sh").read_text(encoding="utf-8")
    content = script.read_text(encoding="utf-8")

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert "golden demo smoke is local-only" in content
    assert "DEMO_PERSONAS" in content
    assert "set-demo-persona" in content
    assert "/v1/demo/reset" in content
    assert "/v1/dashboard/overview" in content
    assert "/v1/adoption/hierarchy" in content
    assert "/v1/adoption/dashboard" in content
    assert "/v1/integrations/overview" in content
    assert "/v1/integrations/scenarios/{scenario_id}/dispatch" in content
    assert "/v1/intercept" in content
    assert "/v1/attribution/manual" in content
    assert "/v1/interventions/INT-401/status" in content
    assert "/v1/forecast/spend" in content
    assert "/v1/attribution/missing-golden-demo-workload" in content
    assert "operator_guidance" in content
    assert "Traceback" in content
    assert 'python3 "${SCRIPT_DIR}/smoke_golden_demo.py" "${BASE_URL}"' in shell_smoke


def test_local_preflight_script_documents_all_setup_assumptions() -> None:
    script = REPO_ROOT / "scripts" / "preflight_local.sh"
    content = script.read_text(encoding="utf-8")

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert "ACI_PREFLIGHT_PROFILE" in content
    assert "set -Eeuo pipefail" in content
    assert "trap on_error ERR" in content
    assert "demo)" in content
    assert "smoke-demo)" in content
    assert "validate)" in content
    assert "shared-backend)" in content
    assert "all)" in content
    assert "macOS, Linux, or WSL2" in content
    assert "Python 3.12+" in content
    assert "python3 -m venv" in content
    assert "python3 -m pip" in content
    assert "Node.js is not required" in content
    assert "npm/pnpm/yarn are not required" in content
    assert "Docker is not required for the 30-second demo" in content
    assert "Docker is required for the shared-backend profile" in content
    assert "Redis, Kafka, and Neo4j" in content
    assert "a modern browser is required" in content
    assert "port ${port} is already in use" in content
    assert "invalid port '${port}'" in content
    assert "set a numeric TCP port from 1 to 65535" in content


def test_demo_reset_script_restores_known_backend_state() -> None:
    script = REPO_ROOT / "scripts" / "reset_demo.sh"
    content = script.read_text(encoding="utf-8")

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert 'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"' in content
    assert 'REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"' in content
    assert 'PORT="${ACI_DEMO_PORT:-8010}"' in content
    assert 'BASE_URL="${ACI_DEMO_BASE_URL:-http://127.0.0.1:${PORT}}"' in content
    assert 'PUBLIC_URL="${ACI_DEMO_PUBLIC_URL:-http://localhost:${PORT}}"' in content
    assert 'APP_RESET_URL="${ACI_RESET_APP_URL:-${PUBLIC_URL}/platform/?reset=1}"' in content
    assert 'OPEN_BROWSER="${ACI_RESET_OPEN_BROWSER:-1}"' in content
    assert 'CLEAR_GENERATED="${ACI_RESET_CLEAR_GENERATED:-1}"' in content
    assert "clear_generated_state" in content
    assert ".demo-smoke*.log" in content
    assert ".demo-start-*.pid" in content
    assert ".demo-start-*.log" in content
    assert "Preserving active server PID file" in content
    assert "Preserving active server log" in content
    assert 'POST "${BASE_URL}/v1/demo/reset"' in content
    assert '"${BASE_URL}/health"' in content
    assert '"${BASE_URL}/ready"' in content
    assert '"${BASE_URL}/platform/"' in content
    assert '"${BASE_URL}/v1/attribution/customer-support-bot"' in content
    assert "browser_reset_url" in content
    assert "Opening browser reset URL" in content
    assert "open \"${APP_RESET_URL}\"" in content
    assert "xdg-open \"${APP_RESET_URL}\"" in content
    assert "wslview \"${APP_RESET_URL}\"" in content
    assert "powershell.exe Start-Process \"${APP_RESET_URL}\"" in content


def test_one_command_startup_script_is_presenter_ready() -> None:
    script = REPO_ROOT / "scripts" / "start_demo.sh"
    content = script.read_text(encoding="utf-8")

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert 'PORT="${ACI_DEMO_PORT:-8000}"' in content
    assert "ACI_PREFLIGHT_PROFILE=demo" in content
    assert "ACI_DEMO_SKIP_PREFLIGHT=1" in content
    assert '"${SCRIPT_DIR}/run_demo.sh"' in content
    assert "nohup env ACI_DEMO_PORT" in content
    assert 'POST "${BASE_URL}/v1/demo/reset"' in content
    assert "wait_for_endpoint \"/health\"" in content
    assert "wait_for_endpoint \"/ready\"" in content
    assert "open_demo_url" in content
    assert "Demo login credentials" in content
    assert "argmin-demo-local" in content
    assert "auth bypass is enabled" in content
    assert "demo_accounts" in content
    assert "ACI_START_DETACH" in content
    assert "ACI_START_OPEN_BROWSER" in content
    assert ".demo-start-${PORT}.log" in content
    assert ".demo-start-${PORT}.pid" in content


def test_docker_compose_uses_dummy_local_defaults_instead_of_required_secrets() -> None:
    compose = (REPO_ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    demo_compose = (REPO_ROOT / "docker-compose.demo.yml").read_text(encoding="utf-8")

    assert "${ACI_NEO4J_PASSWORD:?" not in compose
    assert "argmin-local-neo4j-password" in compose
    assert "argmin-local-jwt-secret" in compose
    assert "argmin-local-demo-secret" in demo_compose
    assert 'ACI_NOTIFICATION_LIVE_NETWORK: "false"' in demo_compose


def test_confidential_exports_are_excluded_from_docker_context() -> None:
    dockerignore = (REPO_ROOT / ".dockerignore").read_text(encoding="utf-8")

    assert "tmp/pdfs/" in dockerignore


def test_local_runtime_scripts_have_clear_preflight_guards() -> None:
    start_demo = (REPO_ROOT / "scripts" / "start_demo.sh").read_text(encoding="utf-8")
    run_demo = (REPO_ROOT / "scripts" / "run_demo.sh").read_text(encoding="utf-8")
    validate_local = (REPO_ROOT / "scripts" / "validate_local.sh").read_text(
        encoding="utf-8"
    )
    smoke_demo = (REPO_ROOT / "scripts" / "smoke_demo.sh").read_text(encoding="utf-8")
    smoke_stack = (REPO_ROOT / "scripts" / "smoke_stack.sh").read_text(encoding="utf-8")

    for content in (start_demo, run_demo, validate_local, smoke_demo, smoke_stack):
        assert "set -Eeuo pipefail" in content
        assert "trap on_error ERR" in content

    assert "ACI_PREFLIGHT_PROFILE=demo" in start_demo
    assert "validate_port_number" in start_demo
    assert "validate_bool \"ACI_START_OPEN_BROWSER\"" in start_demo
    assert "CURL_OPTS=(-fsS --connect-timeout" in start_demo
    assert "is_demo_usable" in start_demo
    assert "ACI_DEMO_SKIP_PREFLIGHT=1" in start_demo
    assert "Demo login credentials" in start_demo
    assert "ACI_PREFLIGHT_PROFILE=demo" in run_demo
    assert "validate_port_number" in run_demo
    assert "Python 3.12+ is required" in run_demo
    assert "require_port_available" in run_demo
    assert "not a usable Python virtual environment" in run_demo
    assert "requirements file not found" in run_demo
    assert "Refusing to run the local demo with ACI_ENVIRONMENT" in run_demo
    assert 'REQUIREMENTS_FILE="${ACI_DEMO_REQUIREMENTS_FILE:-requirements-demo.lock}"' in run_demo
    assert 'export ACI_ENVIRONMENT="demo"' in run_demo
    assert 'export ACI_GRAPH_BACKEND="memory"' in run_demo
    assert 'export ACI_NOTIFICATION_LIVE_NETWORK="false"' in run_demo
    assert 'export PYTHONPATH="${REPO_ROOT}/src${PYTHONPATH:+:${PYTHONPATH}}"' in run_demo
    assert "pip install --no-deps -e ." not in run_demo
    assert "exec uvicorn aci.api.app:app" in run_demo
    assert "ACI_PREFLIGHT_PROFILE=validate" in validate_local
    assert "Python 3.12+ is required" in validate_local
    assert "not a usable Python virtual environment" in validate_local
    assert "required file is missing" in validate_local
    assert "ACI_PREFLIGHT_PROFILE=smoke-demo" in smoke_demo
    assert "validate_port_number" in smoke_demo
    assert "CURL_OPTS=(-fsS --connect-timeout" in smoke_demo
    assert "port ${PORT} is already in use" in smoke_demo
    assert '.demo-smoke-${PORT}.log' in smoke_demo
    assert "ACI_DEMO_SKIP_PREFLIGHT=1" in smoke_demo
    assert "ACI_PREFLIGHT_PROFILE=shared-backend" in smoke_stack
    assert "validate_project_name" in smoke_stack
    assert "CURL_OPTS=(-fsS --connect-timeout" in smoke_stack
    assert "curl is required" in smoke_stack
    assert "docker compose up failed" in smoke_stack
    assert "readiness endpoint did not become ready" in smoke_stack


def test_demo_only_boundaries_are_marked_and_documented() -> None:
    boundary_doc = (REPO_ROOT / "docs" / "demo-only-boundaries.md").read_text(
        encoding="utf-8"
    )
    readme = (REPO_ROOT / "README.md").read_text(encoding="utf-8")
    feature_matrix = (
        REPO_ROOT / "docs" / "feature-demo-coverage-matrix.md"
    ).read_text(encoding="utf-8")
    surface_matrix = (REPO_ROOT / "docs" / "demo-feature-matrix.md").read_text(
        encoding="utf-8"
    )
    app_py = (REPO_ROOT / "src" / "aci" / "api" / "app.py").read_text(encoding="utf-8")
    auth_py = (REPO_ROOT / "src" / "aci" / "api" / "auth.py").read_text(
        encoding="utf-8"
    )
    runtime_py = (REPO_ROOT / "src" / "aci" / "api" / "runtime.py").read_text(
        encoding="utf-8"
    )
    seeder_py = (REPO_ROOT / "src" / "aci" / "demo" / "seeder.py").read_text(
        encoding="utf-8"
    )
    frontend_js = (REPO_ROOT / "frontend" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    schema = (REPO_ROOT / "frontend" / "data" / "SCHEMA.md").read_text(
        encoding="utf-8"
    )
    dataset = json.loads(
        (REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text(
            encoding="utf-8"
        )
    )
    run_demo = (REPO_ROOT / "scripts" / "run_demo.sh").read_text(encoding="utf-8")
    start_demo = (REPO_ROOT / "scripts" / "start_demo.sh").read_text(
        encoding="utf-8"
    )
    reset_demo = (REPO_ROOT / "scripts" / "reset_demo.sh").read_text(
        encoding="utf-8"
    )

    assert "# Demo-Only Boundaries" in boundary_doc
    for marker in (
        "DEMO_ONLY_FIXTURE",
        "DEMO_ONLY_CONTROL_ENDPOINT",
        "DEMO_ONLY_AUTO_SEED",
        "DEMO_ONLY_FAKE_AUTH_BOUNDARY",
        "DEMO_ONLY_LOCAL_ADAPTER_BOUNDARY",
        "DEMO_ONLY_FRONTEND_SURFACE",
        "DEMO_ONLY_FAKE_AUTH_PERSONAS",
        "DEMO_ONLY_SYNTHETIC_FIXTURE",
        "DEMO_ONLY_LAUNCHER",
        "DEMO_ONLY_RESET",
    ):
        assert marker in boundary_doc

    assert "demo-only-boundaries.md" in readme
    assert "demo-only-boundaries.md" in feature_matrix
    assert "demo-only-boundaries.md" in surface_matrix
    for issue_number in range(1, 6):
        issue_url = f"https://github.com/argmin-com/argmin-demo/issues/{issue_number}"
        assert issue_url in boundary_doc
        assert issue_url in readme
        assert issue_url in feature_matrix
    assert "DEMO_ONLY_FIXTURE" in seeder_py
    assert app_py.count("DEMO_ONLY_CONTROL_ENDPOINT") >= 3
    assert "DEMO_ONLY_AUTO_SEED" in runtime_py
    assert "DEMO_ONLY_FAKE_AUTH_BOUNDARY" in auth_py
    assert "DEMO_ONLY_FRONTEND_SURFACE" in frontend_js
    assert "DEMO_ONLY_FAKE_AUTH_PERSONAS" in frontend_js
    assert "DEMO_ONLY_LOCAL_ADAPTER_BOUNDARY" in run_demo
    assert "DEMO_ONLY_FAKE_AUTH_BOUNDARY" in run_demo
    assert "DEMO_ONLY_LAUNCHER" in start_demo
    assert "DEMO_ONLY_LAUNCHER" in run_demo
    assert "DEMO_ONLY_RESET" in reset_demo
    assert "DEMO_ONLY_SYNTHETIC_FIXTURE" in schema
    assert dataset["meta"]["demo_only"] is True
    assert dataset["meta"]["data_classification"] == "DEMO_ONLY_SYNTHETIC_FIXTURE"
    assert "Not customer telemetry" in dataset["meta"]["demo_only_notice"]


def test_demo_docs_avoid_hardcoded_local_app_urls() -> None:
    docs = {
        "README.md": (REPO_ROOT / "README.md").read_text(encoding="utf-8"),
        "frontend/README.md": (REPO_ROOT / "frontend" / "README.md").read_text(
            encoding="utf-8"
        ),
        "docs/demo-guide.md": (REPO_ROOT / "docs" / "demo-guide.md").read_text(
            encoding="utf-8"
        ),
        "docs/demo-feature-matrix.md": (
            REPO_ROOT / "docs" / "demo-feature-matrix.md"
        ).read_text(encoding="utf-8"),
    }

    for path, content in docs.items():
        assert "http://localhost:8000/platform" not in content, path
        assert "http://localhost:8010/platform" not in content, path

    assert "the app URL printed by `./scripts/start_demo.sh`" in docs[
        "frontend/README.md"
    ]
    assert "the configured reset URL" in docs["README.md"]


def test_demo_shell_scripts_avoid_machine_specific_paths() -> None:
    scripts = {
        path.name: path.read_text(encoding="utf-8")
        for path in (REPO_ROOT / "scripts").glob("*.sh")
    }

    for name, content in scripts.items():
        assert "/Users/" not in content, name
        assert "/private/tmp" not in content, name
        assert "/var/folders" not in content, name

    assert 'mktemp -d "${TMPDIR:-/tmp}/aci_wiki_publish_XXXXXX"' in scripts[
        "publish_wiki.sh"
    ]
    assert "mktemp -d /tmp" not in scripts["publish_wiki.sh"]


def test_local_prerequisites_are_documented_in_user_facing_docs() -> None:
    prereqs = (REPO_ROOT / "docs" / "local-prerequisites.md").read_text(
        encoding="utf-8"
    )
    readme = (REPO_ROOT / "README.md").read_text(encoding="utf-8")
    demo_guide = (REPO_ROOT / "docs" / "demo-guide.md").read_text(encoding="utf-8")
    frontend_readme = (REPO_ROOT / "frontend" / "README.md").read_text(
        encoding="utf-8"
    )

    for content in (prereqs, readme, demo_guide):
        assert "macOS, Linux, or WSL2" in content
        assert "Python `3.12+`" in content or "Python 3.12+" in content
        assert "Node.js" in content
        assert "Docker" in content
        assert "database" in content.lower()
        assert "browser" in content.lower()
        assert "port" in content.lower()
        assert "package-manager" in content or "package manager" in content

    assert "./scripts/preflight_local.sh" in readme
    assert "./scripts/preflight_local.sh" in demo_guide
    assert "./scripts/start_demo.sh" in readme
    assert "./scripts/start_demo.sh" in demo_guide
    assert "./scripts/start_demo.sh" in prereqs
    assert "../docs/local-prerequisites.md" in frontend_readme
    assert "not require Node.js" in readme
    assert "No Docker requirement for the default demo path" in prereqs


def test_generated_browser_artifacts_are_excluded_from_repo_contexts() -> None:
    gitignore = (REPO_ROOT / ".gitignore").read_text(encoding="utf-8")
    dockerignore = (REPO_ROOT / ".dockerignore").read_text(encoding="utf-8")
    tracked_browser_artifacts = subprocess.run(
        ["git", "ls-files", ".playwright-cli", "output"],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.splitlines()

    assert ".playwright-cli/" in gitignore
    assert "output/" in gitignore
    assert ".demo-start-*.pid" in gitignore
    assert ".playwright-cli" in dockerignore
    assert "output/" in dockerignore
    assert tracked_browser_artifacts == []


def test_env_example_documents_index_redis_prefix() -> None:
    env_example = (REPO_ROOT / ".env.example").read_text(encoding="utf-8")

    assert "ACI_INDEX_REDIS_PREFIX=aci:idx" in env_example


def test_local_demo_lock_excludes_cloud_and_heavy_dev_dependencies() -> None:
    demo_requirements = {
        line.split("==", 1)[0].lower()
        for line in (REPO_ROOT / "requirements-demo.lock").read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.startswith("#")
    }

    assert "fastapi" in demo_requirements
    assert "uvicorn" in demo_requirements
    assert "aiokafka" not in demo_requirements
    assert "redis" not in demo_requirements
    assert "neo4j" not in demo_requirements
    assert "scikit-learn" not in demo_requirements
    assert "scipy" not in demo_requirements
    assert "numpy" not in demo_requirements
    assert "locust" not in demo_requirements
    assert not any(name.startswith("opentelemetry") for name in demo_requirements)
