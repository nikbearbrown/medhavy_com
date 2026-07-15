#!/usr/bin/env python3
"""Commit and push AI+1 lecture/content files (public/ai1/**) in size-bounded batches.

Hardened successor to push_ai1_in_batches.py:
  - RE-SCANS untracked files each iteration (robust to partial/interrupted runs)
  - NEVER makes an empty commit — if a batch stages nothing it stops loudly
  - Larger default batches + no deploy wait (the Vercel function-size issue is
    solved by the lectures manifest, so batching is only about push size now)

Watches public/ai1/**.{html,mp3,json,js,css}. Run from the repo root.

Usage:
    python3 scripts/push_ai1_lectures.py            # dry run — show what remains
    python3 scripts/push_ai1_lectures.py --run      # commit + push in batches
    python3 scripts/push_ai1_lectures.py --run --max-mib 300 --wait-seconds 60
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PREFIX = ("public", "ai1")
SUFFIXES = {".html", ".mp3", ".json", ".js", ".css"}


def git(*args, check=True):
    return subprocess.run(["git", *args], cwd=REPO, check=check, text=False, capture_output=True)


def text(res):
    return res.stdout.decode("utf-8", errors="replace").strip()


def untracked_and_modified():
    """Files under public/ai1 that git would need to add (untracked + modified)."""
    out = set()
    for cmd in (["ls-files", "--others", "--exclude-standard", "-z"],
                ["diff", "--name-only", "-z"]):
        for raw in git(*cmd).stdout.split(b"\0"):
            if not raw:
                continue
            rel = Path(os.fsdecode(raw))
            if rel.parts[:len(PREFIX)] == PREFIX and rel.suffix.lower() in SUFFIXES:
                out.add(rel)
    return sorted(out, key=lambda p: p.as_posix().lower())


def take_batch(paths, max_files, max_bytes):
    batch, size = [], 0
    for p in paths:
        fsz = (REPO / p).stat().st_size
        if batch and (len(batch) >= max_files or size + fsz > max_bytes):
            break
        batch.append(p); size += fsz
    return batch, size


def staged_count():
    return len([x for x in git("diff", "--cached", "--name-only").stdout.split(b"\0") if x])


def ensure_clean_start():
    branch = text(git("branch", "--show-current"))
    if branch != "main":
        raise SystemExit(f"[STOP] expected branch main, found {branch!r}")
    if git("diff", "--cached", "--quiet", check=False).returncode != 0:
        raise SystemExit("[STOP] you have staged changes; commit or unstage them first")
    lock = REPO / ".git" / "index.lock"
    if lock.exists():
        raise SystemExit(f"[STOP] {lock} exists (another git process, or a stale lock). "
                         f"Close other git processes or `rm -f .git/index.lock`, then retry.")


def push():
    subprocess.run(["git", "push", "origin", "main"], cwd=REPO, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", action="store_true")
    ap.add_argument("--max-files", type=int, default=100)
    ap.add_argument("--max-mib", type=float, default=200.0)
    ap.add_argument("--wait-seconds", type=int, default=0)
    args = ap.parse_args()

    ensure_clean_start()
    remaining = untracked_and_modified()
    total = len(remaining)
    total_mib = sum((REPO / p).stat().st_size for p in remaining) / 1048576
    print(f"{total} files pending under public/ai1  ({total_mib:.1f} MiB)")
    if not total:
        print("Nothing to push — all AI+1 content is already committed.")
        return 0
    if not args.run:
        # preview the batches
        preview, i = list(remaining), 0
        while preview:
            b, sz = take_batch(preview, args.max_files, int(args.max_mib * 1048576))
            i += 1
            print(f"  batch {i:02d}: {len(b):3d} files  {sz/1048576:6.1f} MiB")
            preview = preview[len(b):]
        print("\nDRY RUN — add --run to start")
        return 0

    # push any pre-existing local commit first
    upstream = text(git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}", check=False))
    if upstream:
        ahead = int(text(git("rev-list", "--count", f"{upstream}..HEAD")))
        if ahead:
            print(f"[PUSH] {ahead} pre-existing local commit(s)")
            push()

    n = 0
    while True:
        remaining = untracked_and_modified()
        if not remaining:
            break
        batch, size = take_batch(remaining, args.max_files, int(args.max_mib * 1048576))
        n += 1
        print(f"\n[BATCH {n}] {len(batch)} files · {size/1048576:.1f} MiB", flush=True)
        git("add", "--", *[str(p) for p in batch])
        if staged_count() == 0:
            print("[STOP] git add staged nothing for this batch. Sample paths:")
            for p in batch[:5]:
                print("   ", p)
            print("These files may be git-ignored or unreadable. Nothing was committed this round.")
            return 1
        subprocess.run(["git", "commit", "-m", f"Publish AI+1 lecture content batch {n:03d}"],
                       cwd=REPO, check=True)
        push()
        print(f"[OK] batch {n} pushed", flush=True)
        if args.wait_seconds:
            time.sleep(args.wait_seconds)

    print(f"\n[DONE] {n} batches pushed. All AI+1 content is committed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
