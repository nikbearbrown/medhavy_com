#!/usr/bin/env python3
"""Commit and push AI+1 content (public/ai1/**) in small, deploy-spaced batches.

Adapted from brutalist_art/scripts/push_talk_decks_in_batches.py.
Differences from that script:
  - watches public/ai1/** (lectures + simulations), not public/talks/**
  - includes .html, .mp3, .json, .js, .css (the deck library ships audio and
    manifest JSONs, not just HTML)

Like the original, this ONLY commits the heavy public/ai1 payload. Your app
routes, redirects, sitemap, the Addams rename, and the root-junk deletions are
left uncommitted for a normal reviewed commit (do that BEFORE running this, so
the /ai1 pages exist once the content deploys).

The queue is resumable: committed files leave the working tree, and any
unpushed local commit is pushed before a new batch is created.

Usage:
    python3 scripts/push_ai1_in_batches.py            # dry run — shows the queue
    python3 scripts/push_ai1_in_batches.py --run      # commit, push, wait, repeat
"""

from __future__ import annotations

import argparse
import os
import subprocess
import time
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
PREFIX = ("public", "ai1")
SUFFIXES = {".html", ".mp3", ".json", ".js", ".css"}


def git(*args: str, check: bool = True, capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=REPO, check=check, text=False, capture_output=capture)


def text(result: subprocess.CompletedProcess) -> str:
    return result.stdout.decode("utf-8", errors="replace").strip()


def changed_files() -> list[Path]:
    tracked = git("diff", "--name-only", "-z").stdout.split(b"\0")
    untracked = git("ls-files", "--others", "--exclude-standard", "-z").stdout.split(b"\0")
    paths = set()
    for raw in tracked + untracked:
        if not raw:
            continue
        rel = Path(os.fsdecode(raw))
        if rel.parts[: len(PREFIX)] == PREFIX and rel.suffix.lower() in SUFFIXES:
            paths.add(rel)
    return sorted(paths, key=lambda p: p.as_posix().lower())


def batches(paths: list[Path], max_files: int, max_bytes: int) -> list[list[Path]]:
    result, current, size = [], [], 0
    for path in paths:
        file_size = (REPO / path).stat().st_size
        if current and (len(current) >= max_files or size + file_size > max_bytes):
            result.append(current)
            current, size = [], 0
        current.append(path)
        size += file_size
    if current:
        result.append(current)
    return result


def ahead_count() -> int:
    upstream = text(git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"))
    return int(text(git("rev-list", "--count", f"{upstream}..HEAD")))


def ensure_safe_branch() -> None:
    branch = text(git("branch", "--show-current"))
    if branch != "main":
        raise SystemExit(f"[STOP] expected branch main, found {branch!r}")
    staged = git("diff", "--cached", "--quiet", check=False)
    if staged.returncode != 0:
        raise SystemExit("[STOP] staged changes exist; commit or unstage them before running")


def show_queue(queue: list[list[Path]]) -> None:
    total_bytes = 0
    for index, batch in enumerate(queue, 1):
        size = sum((REPO / path).stat().st_size for path in batch)
        total_bytes += size
        family = batch[0].parts[2] if len(batch[0].parts) > 2 else "ai1"
        print(f"{index:03d}  {len(batch):2d} files  {size / 1048576:6.1f} MiB  {family}")
        for path in batch:
            print(f"      {path}")
    print(f"\n{len(queue)} batches · {sum(map(len, queue))} files · {total_bytes / 1048576:.1f} MiB")


def push() -> None:
    subprocess.run(["git", "push", "origin", "main"], cwd=REPO, check=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run", action="store_true", help="actually commit, push, and wait")
    parser.add_argument("--max-files", type=int, default=5)
    parser.add_argument("--max-mib", type=float, default=80.0)
    parser.add_argument("--wait-seconds", type=int, default=600)
    parser.add_argument("--no-initial-wait", action="store_true",
                        help="do not wait after pushing a pre-existing local commit")
    args = parser.parse_args()
    if args.max_files < 1 or args.max_mib <= 0 or args.wait_seconds < 0:
        parser.error("batch sizes must be positive and wait must be non-negative")

    ensure_safe_branch()
    queue = batches(changed_files(), args.max_files, int(args.max_mib * 1048576))
    show_queue(queue)
    if not args.run:
        print("\nDRY RUN — add --run to start the deployment queue")
        return 0

    ahead = ahead_count()
    if ahead:
        print(f"\n[PUSH] {ahead} pre-existing local commit(s)", flush=True)
        push()
        if queue and args.wait_seconds and not args.no_initial_wait:
            print(f"[WAIT] {args.wait_seconds}s for deployment", flush=True)
            time.sleep(args.wait_seconds)

    for index, batch in enumerate(queue, 1):
        size = sum((REPO / path).stat().st_size for path in batch)
        print(f"\n[BATCH {index}/{len(queue)}] {len(batch)} files · {size / 1048576:.1f} MiB", flush=True)
        subprocess.run(["git", "add", "--", *map(str, batch)], cwd=REPO, check=True)
        subprocess.run(["git", "commit", "-m", f"Publish AI+1 content batch {index:03d}"], cwd=REPO, check=True)
        push()
        print(f"[OK] batch {index} pushed", flush=True)
        if index < len(queue) and args.wait_seconds:
            print(f"[WAIT] {args.wait_seconds}s for deployment", flush=True)
            time.sleep(args.wait_seconds)

    print("\n[DONE] all AI+1 content batches pushed")
    print("Reminder: app routes, redirects, sitemap, Addams rename, and root-junk")
    print("deletions are committed separately (do that first, if you haven't).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
