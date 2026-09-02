import Link from "next/link";
import { Listing } from "@/components/listing";

const nav: Array<{ group: string; items: Array<[string, string]> }> = [
  {
    group: "Getting started",
    items: [
      ["installation", "Installation"],
      ["quick-start", "Quick start"],
      ["ids", "Checkpoint IDs"],
    ],
  },
  {
    group: "CLI reference",
    items: [
      ["cmd-init", "varn init"],
      ["cmd-checkpoint", "varn checkpoint"],
      ["cmd-list", "varn list"],
      ["cmd-diff", "varn diff"],
      ["cmd-restore", "varn restore"],
      ["cmd-gc", "varn gc"],
      ["cmd-migrate", "varn migrate"],
    ],
  },
  {
    group: "Guides",
    items: [
      ["ignore", "Ignore patterns"],
      ["git", "Git coexistence"],
      ["json", "JSON output"],
      ["safety", "Safety model"],
    ],
  },
];

const installScript =
  "curl -fsSL https://raw.githubusercontent.com/flawme/varn/main/install.sh | sh";
const installVersion =
  "curl -fsSL https://raw.githubusercontent.com/flawme/varn/main/install.sh | sh -s -- v0.3.0";
const installCargo = "cargo install --git https://github.com/flawme/varn.git";
const installSource = `git clone https://github.com/flawme/varn.git
cd varn
cargo build --release`;
const quickStart = `varn init
varn checkpoint "before changes"
# ... make changes ...
varn diff <checkpoint-id>
varn restore <checkpoint-id>`;
const ignoreExample = `# Comments and blank lines are ignored
*.log                    # Match by extension (any depth)
target/                  # Directory-only (trailing slash)
/build                   # Anchored to root (leading slash)
**/cache/                # Match at any depth
!important.log           # Negation (re-include)`;
const jsonCheckpoint = `{
  "status": "ok",
  "checkpoint_id": "a91f3c2b4d5e",
  "description": "test",
  "created_at": 1787162040,
  "root": "/project",
  "entries": 12,
  "saved": true,
  "warnings": []
}`;
const jsonDiff = `{
  "status": "ok",
  "checkpoint": "a91f3c2b4d5e",
  "changes": [
    { "kind": "added", "path": "src/new_file.rs" },
    { "kind": "modified", "path": "src/main.rs" },
    { "kind": "deleted", "path": "old_config.json" }
  ]
}`;
const jsonRestore = `{
  "status": "ok",
  "checkpoint": "a91f3c2b4d5e",
  "safety_checkpoint": "b72c1a3e5f7d",
  "files_written": 3,
  "dirs_created": 1,
  "symlinks_created": 0,
  "deleted": 2,
  "verified": true,
  "warnings": []
}`;

const ignorePatterns: Array<[string, string]> = [
  ["*.log", "Any file ending in .log, at any depth"],
  ["target/", "A directory named target (and all its contents)"],
  ["/build", "A path named build at the root only"],
  ["**/cache/", "A directory named cache at any depth"],
  ["!important.log", "Re-includes a file previously excluded"],
  ["file[0-9].txt", "One character from the set 0-9"],
  ["?", "Any single character except /"],
];

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-bold tracking-tight mt-10 mb-4 scroll-mt-20">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-bold mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed mb-3">{children}</p>;
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="text-[13px] bg-[var(--box)] border border-[var(--rule)] rounded px-1 py-0.5">{children}</code>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
    >
      {children}
    </a>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen">
      {/* Running header */}
      <header className="border-b border-[var(--rule)] sticky top-0 z-20 bg-[var(--paper)]">
        <div className="max-w-[1100px] mx-auto px-6 h-10 flex items-center justify-between text-xs text-[var(--muted-ink)]">
          <span>varn.flawme.sbs — documentation</span>
          <nav className="flex items-center gap-5">
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              Overview
            </Link>
            <a
              href="https://github.com/flawme/varn"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--ink)] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[var(--accent)] font-medium">v0.3.0</span>
          </nav>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 flex gap-12">
        {/* Left sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <nav className="sticky top-16 py-10 text-[13px]">
            {nav.map((group) => (
              <div key={group.group} className="mb-6">
                <p className="font-bold tracking-wide text-[11px] uppercase text-[var(--muted-ink)] mb-2">
                  {group.group}
                </p>
                <ul className="space-y-1.5 border-l border-[var(--rule)]">
                  {group.items.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="block pl-3 -ml-px border-l border-transparent text-[var(--muted-ink)] hover:text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Right content */}
        <main className="flex-1 min-w-0 pb-16 max-w-[720px]">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--muted-ink)] pt-12 mb-2">
            DOCUMENTATION
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Varn CLI reference &amp; guides
          </h1>

          {/* Installation */}
          <H id="installation">Installation</H>
          <H3>Option 1 — Install script (recommended)</H3>
          <P>
            Auto-detects your platform (Linux and macOS, x86_64 and aarch64), downloads the
            binary, and adds it to your PATH:
          </P>
          <Listing>{installScript}</Listing>
          <P>
            To install a specific version, append the version tag:
          </P>
          <Listing>{installVersion}</Listing>
          <P>
            Flags: <C>--bin-dir &lt;path&gt;</C> overrides the install directory,{" "}
            <C>--no-modify-path</C> leaves your shell config alone. Windows users: download{" "}
            <C>varn-windows-x86_64.exe</C> from the{" "}
            <A href="https://github.com/flawme/varn/releases">releases page</A> and place it
            in a directory on your <C>PATH</C>.
          </P>
          <H3>Option 2 — Cargo</H3>
          <P>
            Requires Rust 1.85+. Builds from source and installs to{" "}
            <C>~/.cargo/bin/</C>:
          </P>
          <Listing>{installCargo}</Listing>
          <H3>Option 3 — Build from source</H3>
          <Listing>{installSource}</Listing>
          <P>
            The binary is at <C>target/release/varn</C>. Verify any install with{" "}
            <C>varn --help</C>.
          </P>

          {/* Quick start */}
          <H id="quick-start">Quick start</H>
          <P>
            Three commands between you and a rollback point. Initialize in any directory —{" "}
            <C>varn init</C> only creates <C>.varn/</C> and never touches existing files:
          </P>
          <Listing>{quickStart}</Listing>
          <P>
            <C>varn diff</C> classifies every change as added, modified, or deleted.{" "}
            <C>varn restore</C> plans the restore, asks for confirmation if anything would
            be overwritten or deleted, captures a safety checkpoint of the current state,
            executes, and verifies the result.
          </P>

          {/* Checkpoint IDs */}
          <H id="ids">Checkpoint IDs</H>
          <P>
            A checkpoint ID is the first 12 hex characters of a SHA-256 hash over the
            snapshot&apos;s description, timestamp, root path, and all entry metadata —
            deterministic, so checkpointing the same state twice is a no-op (reported as{" "}
            <C>status: &quot;unchanged&quot;</C> in JSON mode). IDs can be used by prefix,
            as long as the prefix is unambiguous:
          </P>
          <Listing>{`varn diff a91f           # Prefix match
varn restore a91f3c2b    # Longer prefix`}</Listing>
          <P>
            If a prefix matches multiple checkpoints, Varn reports an ambiguity error
            rather than guessing.
          </P>

          {/* Commands */}
          <H id="cmd-init">
            <C>varn init</C>
          </H>
          <Listing>{`varn init              # Initialize in current directory
varn init /path/to/dir # Initialize in a specific directory
varn init --gitignore  # Also add .varn/ to the root .gitignore`}</Listing>
          <P>
            Creates a <C>.varn/</C> directory with storage layout and config. Does not
            touch any existing files. Inside a git repository, Varn also creates{" "}
            <C>.varn/.gitignore</C> containing <C>*</C>, which makes Git ignore the entire
            store — protecting against a blind <C>git add -A</C> staging tens of thousands
            of content objects. Nothing outside <C>.varn/</C> is modified.
          </P>
          <P>
            With <C>--gitignore</C>, Varn additionally appends <C>.varn/</C> to the
            enclosing repository&apos;s root <C>.gitignore</C> (no duplicate entries). The
            flag fails with an actionable error if the directory is not inside a git
            repository.
          </P>

          <H id="cmd-checkpoint">
            <C>varn checkpoint</C>
          </H>
          <Listing>{`varn checkpoint "before agent task"`}</Listing>
          <P>
            Captures the current filesystem state: a unique ID, timestamp, description,
            root path, and the full tree (paths, metadata, content hashes). File contents
            go into the content-addressed object store with deduplication. Checkpointing
            the same state twice is a no-op. Scanning is incremental — a persistent cache
            reuses content hashes for files whose size and mtime are unchanged; the cache
            is advisory and never affects correctness.
          </P>

          <H id="cmd-list">
            <C>varn list</C>
          </H>
          <Listing>{`ID             TIME                 DESCRIPTION
a91f3c2b4d5e   2026-08-19 20:14    before agent task
b72c1a3e5f7d   2026-08-19 20:27    after agent task`}</Listing>

          <H id="cmd-diff">
            <C>varn diff</C>
          </H>
          <Listing>{`varn diff a91f          # Use a checkpoint ID prefix
varn diff a91f3c2b4d5e  # Use a full checkpoint ID`}</Listing>
          <Listing caption="Output: every change classified as added, modified, or deleted.">{`ADDED
  src/new_file.rs

MODIFIED
  src/main.rs

DELETED
  old_config.json`}</Listing>

          <H id="cmd-restore">
            <C>varn restore</C>
          </H>
          <Listing>{`varn restore a91f                          # Interactive (prompts on conflicts)
varn restore a91f --yes                    # Skip confirmation prompts
varn restore a91f --yes --no-safety        # Skip safety checkpoint too`}</Listing>
          <P>
            By default, restore creates a <strong>safety checkpoint</strong> of the
            current state before restoring, so a failed or unwanted restore can be undone.
            If conflicts are detected (modified or unexpected files), Varn lists what
            would be overwritten or deleted, asks for confirmation unless <C>--yes</C> is
            passed, executes, and verifies the result matches the checkpoint.
          </P>

          <H id="cmd-gc">
            <C>varn gc</C>
          </H>
          <Listing>{`varn gc             # Delete unreferenced objects
varn gc --dry-run   # Preview what would be deleted`}</Listing>
          <P>
            Removes objects no snapshot references. Safe to run at any time — objects
            referenced by any existing snapshot are always preserved.
          </P>

          <H id="cmd-migrate">
            <C>varn migrate</C>
          </H>
          <Listing>{`varn migrate             # Run pending migrations
varn migrate --dry-run   # Check if migration is needed`}</Listing>
          <P>
            Migrates the storage format to the current version and backfills the
            store-level git guard (<C>.varn/.gitignore</C>) for legacy stores. If the
            repository is already current, nothing changes; if it is newer than this
            Varn supports, an error is returned.
          </P>

          {/* Ignore patterns */}
          <H id="ignore">Ignore patterns</H>
          <P>
            Place a <C>.varnignore</C> file at the root of your Varn-managed directory.
            It is loaded automatically by <C>varn checkpoint</C> and <C>varn diff</C>. The
            syntax follows gitignore conventions:
          </P>
          <Listing>{ignoreExample}</Listing>
          <div className="border border-[var(--rule)] rounded overflow-hidden my-5">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-[var(--box)] border-b border-[var(--rule)]">
                  <th className="px-4 py-2 text-left font-semibold">Pattern</th>
                  <th className="px-4 py-2 text-left font-semibold">Matches</th>
                </tr>
              </thead>
              <tbody>
                {ignorePatterns.map(([pat, desc], i) => (
                  <tr key={pat} className={i % 2 === 1 ? "bg-[var(--box)]" : ""}>
                    <td className="px-4 py-2 font-mono text-[13px] whitespace-nowrap">{pat}</td>
                    <td className="px-4 py-2 text-[var(--muted-ink)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            Ignored directories are not recursed into. The matcher is recursive with
            backtracking, so <C>**/*.log</C> matches <C>app.log</C> at the root as well as
            nested paths.
          </P>

          {/* Git coexistence */}
          <H id="git">Git coexistence</H>
          <P>Varn is designed to coexist with Git in the same directory:</P>
          <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed mb-3">
            <li>
              <C>varn init</C> creates <C>.varn/.gitignore</C> containing <C>*</C>, so Git
              ignores the entire store automatically. Nothing outside <C>.varn/</C> is
              modified.
            </li>
            <li>
              Varn never reads or writes Git metadata (<C>.git/</C>, index, refs).
            </li>
            <li>
              <C>varn checkpoint</C> skips <C>.varn/</C> during scans, so checkpointing a
              git-managed directory does not capture Git&apos;s internals.
            </li>
            <li>
              If the store is not excluded from git (a legacy store), commands warn with a
              one-line fix: <C>echo &apos;.varn/&apos; &gt;&gt; .gitignore</C>.{" "}
              <C>varn init --gitignore</C> applies it for you; <C>varn migrate</C>{" "}
              backfills the store-level guard.
            </li>
          </ul>

          {/* JSON output */}
          <H id="json">JSON output</H>
          <P>
            Every command accepts a global <C>--json</C> flag. Errors are also emitted as
            JSON (to stderr), making Varn suitable for consumption by AI agents and
            automation tools:
          </P>
          <Listing>{`varn --json checkpoint "before changes"
varn --json list
varn --json diff a91f
varn --json restore a91f --yes
varn --json gc --dry-run
varn --json migrate --dry-run`}</Listing>
          <H3>
            <C>varn --json checkpoint</C>
          </H3>
          <Listing>{jsonCheckpoint}</Listing>
          <H3>
            <C>varn --json diff</C>
          </H3>
          <Listing>{jsonDiff}</Listing>
          <H3>
            <C>varn --json restore</C>
          </H3>
          <Listing>{jsonRestore}</Listing>
          <H3>Errors</H3>
          <Listing>{`{
  "status": "error",
  "error": "checkpoint not found: xyz"
}`}</Listing>

          {/* Safety model */}
          <H id="safety">Safety model</H>
          <P>
            Varn treats restoration as a potentially destructive operation. Core
            guarantees: destructive operations are never silent; restoration is always
            explicit; <C>init</C> never modifies anything outside <C>.varn/</C>; Varn
            never touches Git metadata; and there is no network communication, no
            telemetry, no account.
          </P>
          <P>The restore pipeline has four phases:</P>
          <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-relaxed mb-3">
            <li>
              <strong>Plan</strong> — compare the target snapshot with the current
              filesystem; enumerate every action plus any conflicts.
            </li>
            <li>
              <strong>Confirm</strong> — conflicts require explicit confirmation (or{" "}
              <C>--yes</C>).
            </li>
            <li>
              <strong>Execute</strong> — restore contents from the object store, delete
              unexpected files, recreate directories.
            </li>
            <li>
              <strong>Verify</strong> — re-scan the filesystem and confirm it matches the
              snapshot: kind, content hash, symlink target, readonly flag, and mtime.
            </li>
          </ol>
          <P>
            A <strong>conflict</strong> means the current state differs from the snapshot
            in a way that would cause data loss: a file modified since the checkpoint
            (would be overwritten), or a file that exists now but not in the checkpoint
            (would be deleted). Conflicts require confirmation before proceeding.
          </P>
          <P>
            The engine is hardened against adversarial filesystems: path traversal is
            rejected (<C>..</C> components, absolute paths); symlink escape is checked on
            every ancestor directory before any write (CVE-2026-71556 class); hard-link
            targets are verified not to be symlinks (CVE-2026-32232 class); object
            content is re-hashed after leaving the store and before touching the disk; and
            a pre-flight check confirms all referenced objects exist before anything is
            modified — a restore can fail, but it cannot fail halfway.
          </P>

          <div className="mt-12 border-t border-[var(--rule)] pt-6 text-[13px] text-[var(--muted-ink)]">
            Full docs in the repository:{" "}
            <A href="https://github.com/flawme/varn/blob/main/docs/usage.md">usage.md</A>,{" "}
            <A href="https://github.com/flawme/varn/blob/main/docs/safety.md">safety.md</A>,{" "}
            <A href="https://github.com/flawme/varn/blob/main/docs/architecture.md">
              architecture.md
            </A>
            .
          </div>
        </main>
      </div>

      <footer className="border-t border-[var(--rule)]">
        <div className="max-w-[1100px] mx-auto px-6 h-10 flex items-center justify-between text-xs text-[var(--muted-ink)]">
          <span>© {new Date().getFullYear()} flawme</span>
          <a href="https://flawme.sbs" className="hover:text-[var(--ink)] transition-colors">
            flawme.sbs
          </a>
        </div>
      </footer>
    </div>
  );
}
