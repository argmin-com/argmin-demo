from __future__ import annotations

import re
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


def test_demo_reset_script_restores_known_backend_state() -> None:
    script = REPO_ROOT / "scripts" / "reset_demo.sh"
    content = script.read_text(encoding="utf-8")

    assert script.exists()
    assert script.stat().st_mode & S_IXUSR
    assert 'PORT="${ACI_DEMO_PORT:-8010}"' in content
    assert 'BASE_URL="${ACI_DEMO_BASE_URL:-http://127.0.0.1:${PORT}}"' in content
    assert 'POST "${BASE_URL}/v1/demo/reset"' in content
    assert '"${BASE_URL}/health"' in content
    assert '"${BASE_URL}/ready"' in content
    assert '"${BASE_URL}/v1/attribution/customer-support-bot"' in content


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
    run_demo = (REPO_ROOT / "scripts" / "run_demo.sh").read_text(encoding="utf-8")
    validate_local = (REPO_ROOT / "scripts" / "validate_local.sh").read_text(
        encoding="utf-8"
    )
    smoke_demo = (REPO_ROOT / "scripts" / "smoke_demo.sh").read_text(encoding="utf-8")
    smoke_stack = (REPO_ROOT / "scripts" / "smoke_stack.sh").read_text(encoding="utf-8")

    assert "Python 3.12+ is required" in run_demo
    assert "require_port_available" in run_demo
    assert "not a usable Python virtual environment" in run_demo
    assert "Refusing to run the local demo with ACI_ENVIRONMENT" in run_demo
    assert 'REQUIREMENTS_FILE="${ACI_DEMO_REQUIREMENTS_FILE:-requirements-demo.lock}"' in run_demo
    assert 'export ACI_ENVIRONMENT="demo"' in run_demo
    assert 'export ACI_GRAPH_BACKEND="memory"' in run_demo
    assert 'export ACI_NOTIFICATION_LIVE_NETWORK="false"' in run_demo
    assert 'export PYTHONPATH="${REPO_ROOT}/src${PYTHONPATH:+:${PYTHONPATH}}"' in run_demo
    assert "pip install --no-deps -e ." not in run_demo
    assert "Python 3.12+ is required" in validate_local
    assert "not a usable Python virtual environment" in validate_local
    assert "port ${PORT} is already in use" in smoke_demo
    assert '.demo-smoke-${PORT}.log' in smoke_demo
    assert "curl is required" in smoke_stack
    assert "docker compose up failed" in smoke_stack
    assert "readiness endpoint did not become ready" in smoke_stack


def test_generated_browser_artifacts_are_excluded_from_repo_contexts() -> None:
    gitignore = (REPO_ROOT / ".gitignore").read_text(encoding="utf-8")
    dockerignore = (REPO_ROOT / ".dockerignore").read_text(encoding="utf-8")
    browser_artifact_dir = REPO_ROOT / ".playwright-cli"
    committed_snapshots = []
    if browser_artifact_dir.exists():
        committed_snapshots = [
            path.name
            for path in browser_artifact_dir.iterdir()
            if path.is_file() and path.suffix in {".log", ".yml", ".yaml"}
        ]

    assert ".playwright-cli/" in gitignore
    assert ".playwright-cli" in dockerignore
    assert committed_snapshots == []


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
