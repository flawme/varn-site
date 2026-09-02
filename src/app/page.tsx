import Link from "next/link";
import { Listing } from "@/components/listing";

const installCmd =
  "curl -fsSL https://raw.githubusercontent.com/flawme/varn/main/install.sh | sh";

const quickStart = `varn init
varn checkpoint "before changes"
# ... make changes ...
varn diff <checkpoint-id>
varn restore <checkpoint-id>`;

const moduleTree = `src/
├── main.rs              Binary entry point
├── cli/                 Argument parsing, command dispatch, formatting
├── core.rs              Domain models: checkpoint identity, snapshot metadata
├── filesystem/          Scanner, ignore patterns, incremental scan cache
├── snapshot/            Snapshot persistence, deterministic checkpoint IDs
├── storage/             Content-addressed object store, GC, migration
├── diff.rs              Diff engine: comparing two states
├── restore/             Plan, execute, verify
├── platform.rs          OS-specific abstractions
└── error.rs             Unified error types`;

const exampleSession = `$ varn checkpoint "before agent task"
$ # agent modifies files...
$ varn diff a91f3c2b4d5e

ADDED
  src/new_file.rs

MODIFIED
  src/main.rs

$ varn restore a91f3c2b4d5e`;

const commands: Array<[string, string]> = [
  ["varn init [path]", "Initialize Varn in a directory"],
  ["varn checkpoint <desc>", "Capture the current filesystem state"],
  ["varn list", "Display available checkpoints"],
  ["varn diff <checkpoint>", "Compare current state with a checkpoint"],
  ["varn restore <checkpoint>", "Restore a checkpoint"],
  ["varn gc", "Remove unreferenced objects from the store"],
  ["varn migrate", "Migrate storage format to the current version"],
  ["varn --json <command>", "Emit machine-readable JSON output"],
];

const platforms: Array<[string, string, string]> = [
  ["Linux", "Officially tested", "Full CI matrix on every commit"],
  ["Windows", "Officially tested", "Full CI matrix; field-tested on Windows 11 / NTFS"],
  ["macOS", "Best-effort field testing", "Full CI matrix on every commit"],
];

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold tracking-tight mt-8 mb-3">
      <span className="text-[var(--accent)] mr-2">{n}</span>
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Running header */}
      <header className="border-b border-[var(--rule)]">
        <div className="max-w-[1100px] mx-auto px-6 h-10 flex items-center justify-between text-xs text-[var(--muted-ink)]">
          <span>varn.flawme.sbs — technical overview</span>
          <nav className="flex items-center gap-5">
            <Link
              href="/docs"
              className="text-[var(--accent)] font-medium hover:underline underline-offset-4"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/flawme/varn"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--ink)] transition-colors"
            >
              GitHub
            </a>
            <span>v0.3.0</span>
          </nav>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pb-16">
        {/* Title block */}
        <section className="text-center pt-16 pb-10 border-b border-[var(--rule)]">
          <h1 className="text-3xl md:text-[2.6rem] leading-tight font-bold tracking-tight max-w-4xl mx-auto">
            Varn: Local Filesystem Checkpointing and Safe Rollback for AI Agents and
            Automated Tools
          </h1>
          <p className="mt-6 text-[15px] text-[var(--ink)]">
            Mehul <span className="text-[var(--muted-ink)]">(flawme)</span>
          </p>
          <p className="mt-1 text-[13px] text-[var(--muted-ink)]">
            flawme.sbs — github.com/flawme/varn
          </p>
          <p className="mt-1 text-[13px] text-[var(--muted-ink)]">
            September 2026 · Release v0.3.0
          </p>
        </section>

        {/* Abstract */}
        <section className="max-w-3xl mx-auto pt-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--muted-ink)] text-center mb-4">
            ABSTRACT
          </p>
          <p className="text-[15px] leading-relaxed text-justify hyphens-auto">
            An automated process — increasingly often an AI agent — modifies files on a local
            machine and leaves behind a question: <em>what exactly changed, and can the
            previous state be restored safely?</em> Varn addresses this problem with a local
            checkpointing and rollback system that captures a known state of the filesystem,
            reports the difference between that state and the present one, and restores the
            earlier state through a conservative, explicitly confirmed pipeline. Checkpoints
            are content-addressed and idempotent; storage is deduplicated by SHA-256 hashing;
            and every restore is preceded by a safety checkpoint of the current state, so
            even a failed restore can be undone. The system runs entirely offline, coexists
            with Git without touching its metadata, and exposes machine-readable JSON output
            for agent integration. This document describes the design, architecture, safety
            model, and security hardening of Varn, and reports its current platform support.
          </p>
          <p className="mt-5 text-[13px] text-[var(--muted-ink)]">
            <span className="font-semibold text-[var(--ink)]">Keywords:</span> filesystem
            snapshots · checkpoint/rollback · content-addressed storage · AI agent safety ·
            local-first software
          </p>
        </section>

        {/* 1-2: two columns */}
        <div className="grid lg:grid-cols-2 lg:gap-10 mt-4">
          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="1">Introduction</SectionTitle>
            <p className="mb-3">
              Version control systems such as Git track the history of a project&apos;s
              source code, but they deliberately do not protect the broader local state a
              program operates on: configuration files, generated artifacts, permissions,
              symlinks, and everything else an agent may touch between two commits. When an
              automated tool misbehaves, the operator is left to reconstruct what happened
              by hand.
            </p>
            <p className="mb-3">
              Varn is a command-line tool that treats the local filesystem itself as the
              versioned artifact. It is <em>not Git</em>: it implements no branches,
              remotes, merges, or history rewriting, and it never reads or writes Git
              metadata. It complements Git — Git tracks project history; Varn protects
              local state.
            </p>
            <p>
              The design targets AI agents and automated tools first, humans second. Every
              command supports a <code className="text-[13px]">--json</code> flag;
              destructive operations are never silent; and the tool requires no network
              access, accounts, or telemetry.
            </p>
          </section>

          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="2">Design principles</SectionTitle>
            <p className="mb-3">
              <strong>Local-first.</strong> All operations are local. No network, no
              accounts, no telemetry. The object store, snapshots, and caches live under a
              single <code className="text-[13px]">.varn/</code> directory at the scan root.
            </p>
            <p className="mb-3">
              <strong>Cross-platform.</strong> Linux, macOS, and Windows are first-class
              targets. Platform-specific behavior is isolated in one module; core logic
              contains no operating-system conditionals. Every commit runs the full test
              suite on all three platforms.
            </p>
            <p className="mb-3">
              <strong>Safety first.</strong> Restoration is treated as a potentially
              destructive operation. Varn never silently overwrites conflicting changes,
              and <code className="text-[13px]">init</code> never touches existing user
              files.
            </p>
            <p>
              <strong>Git coexistence.</strong> The store is automatically gitignored from
              inside (<code className="text-[13px]">.varn/.gitignore</code> containing{" "}
              <code className="text-[13px]">*</code>), so a blind{" "}
              <code className="text-[13px]">git add -A</code> never stages tens of
              thousands of content objects.
            </p>
          </section>
        </div>

        {/* Figure 1 */}
        <section className="mt-10">
          <Listing caption="Figure 1 — Module structure of the Rust codebase.">
            {moduleTree}
          </Listing>
        </section>

        {/* 3-4: two columns */}
        <div className="grid lg:grid-cols-2 lg:gap-10">
          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="3">System architecture</SectionTitle>
            <p className="mb-3">
              The scanner walks the managed root recursively and produces a sorted list of
              tree entries with SHA-256 content hashes. It uses symlink metadata rather
              than following links, so a symlink is recorded as a symlink and the scan can
              never escape the root through one. Per-entry errors are collected as
              warnings instead of aborting, and{" "}
              <code className="text-[13px]">.varnignore</code> patterns (gitignore-style)
              are applied during the walk.
            </p>
            <p className="mb-3">
              File contents are stored as content-addressed blobs keyed by their SHA-256
              hash, sharded into two-character directories. Identical contents are stored
              once, which makes checkpointing after small changes cheap and enables
              deduplication across checkpoints.
            </p>
            <p>
              Checkpoint identifiers are deterministic — the first 12 hex characters of a
              hash over the snapshot&apos;s description, timestamp, root, and all entry
              metadata — so checkpointing the same state twice is a no-op, reported as{" "}
              <code className="text-[13px]">status: &quot;unchanged&quot;</code> in JSON
              mode. Scanning is incremental: a persistent cache reuses content hashes for
              files whose size and modification time are unchanged. The cache is advisory;
              correctness never depends on it.
            </p>
          </section>

          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="4">The checkpoint lifecycle</SectionTitle>
            <p className="mb-2">
              A working session is five commands: initialize, checkpoint, work, diff, and
              — if needed — restore.
            </p>
            <Listing caption="Listing 1 — Quick start.">{quickStart}</Listing>
            <p className="mb-2">
              The diff output classifies every change as added, modified, or deleted, using
              checkpoint-ID prefixes so agents never need to copy full identifiers.
            </p>
            <Listing caption="Listing 2 — An agent session, observed and rolled back.">
              {exampleSession}
            </Listing>
          </section>
        </div>

        {/* Table 1 */}
        <section className="mt-10">
          <p className="text-[13px] text-[var(--muted-ink)] text-center mb-3">
            Table 1 — Command surface.
          </p>
          <div className="max-w-3xl mx-auto border border-[var(--rule)] rounded overflow-hidden">
            <table className="w-full text-[14px]">
              <tbody>
                {commands.map(([cmd, desc], i) => (
                  <tr key={cmd} className={i % 2 === 0 ? "bg-[var(--box)]" : ""}>
                    <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap align-top">
                      {cmd}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--muted-ink)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5-6: two columns */}
        <div className="grid lg:grid-cols-2 lg:gap-10 mt-2">
          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="5">The restore safety model</SectionTitle>
            <p className="mb-3">
              Restoration follows a strict four-phase pipeline. In the{" "}
              <strong>plan</strong> phase, the target snapshot is compared with the
              current filesystem and every required action — write, create, link, delete —
              is enumerated together with any conflicts. A conflict means the present
              state differs from the snapshot in a way that would cause data loss: a file
              modified since the checkpoint, or a file that now exists but did not then.
            </p>
            <p className="mb-3">
              In the <strong>confirm</strong> phase, conflicts require explicit user
              confirmation, or the <code className="text-[13px]">--yes</code> flag. Before{" "}
              <strong>execution</strong>, Varn captures a safety checkpoint of the current
              state, so a failed or unwanted restore can itself be undone — with{" "}
              <code className="text-[13px]">--no-safety</code> available for operators who
              know better. Finally, the <strong>verify</strong> phase re-scans the
              filesystem and confirms it matches the snapshot — kind, content hash,
              symlink target, permissions, and modification times, not just content.
            </p>
          </section>

          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="6">Security hardening</SectionTitle>
            <p className="mb-3">
              The restore engine assumes an adversarial environment — a malicious or buggy
              process may have rearranged the filesystem between checkpoint and restore.
              Several classes of attack are explicitly defended against:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>
                <strong>Path traversal.</strong> All restore paths are validated;{" "}
                <code className="text-[13px]">..</code> components and absolute paths are
                rejected.
              </li>
              <li>
                <strong>Symlink escape.</strong> Before any write, every ancestor
                directory of the target path is checked so a planted symlink cannot
                redirect the write outside the managed root (CVE-2026-71556 class).
              </li>
              <li>
                <strong>Hard-link aliasing.</strong> Hard-link creation verifies the
                target is not a symlink, preventing inode aliasing of external files
                (CVE-2026-32232 class).
              </li>
              <li>
                <strong>Object tampering.</strong> Content is re-hashed after leaving the
                store and before touching the disk, so corrupted or tampered objects are
                caught before they overwrite user data.
              </li>
            </ul>
            <p>
              A pre-flight check confirms every object referenced by the plan exists
              before anything is modified — a restore can fail, but it cannot fail
              halfway.
            </p>
          </section>
        </div>

        {/* Table 2 */}
        <section className="mt-10">
          <p className="text-[13px] text-[var(--muted-ink)] text-center mb-3">
            Table 2 — Platform support (release v0.3.0).
          </p>
          <div className="max-w-3xl mx-auto border border-[var(--rule)] rounded overflow-hidden">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-[var(--box)] border-b border-[var(--rule)]">
                  <th className="px-4 py-2.5 text-left font-semibold">Platform</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Field status</th>
                  <th className="px-4 py-2.5 text-left font-semibold">
                    Continuous integration
                  </th>
                </tr>
              </thead>
              <tbody>
                {platforms.map(([name, field, ci], i) => (
                  <tr key={name} className={i % 2 === 1 ? "bg-[var(--box)]" : ""}>
                    <td className="px-4 py-2.5 font-medium">{name}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-ink)]">{field}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-ink)]">{ci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7-8: two columns */}
        <div className="grid lg:grid-cols-2 lg:gap-10 mt-2">
          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="7">Evaluation</SectionTitle>
            <p className="mb-3">
              The test suite comprises 440+ tests, including a dedicated regression tree
              organized by platform — every field-reported bug from every operating
              system has a permanent, named test. The full suite runs on Linux, Windows,
              and macOS runners on every commit, so all three platforms compile and pass
              the same regression suite continuously.
            </p>
            <p>
              The regression process has already paid for itself: it exposed two real
              race conditions in concurrent checkpointing (predictable temporary-file
              names in the object store and cache saves), both fixed in v0.3.0 with
              unique per-write temp names and cleanup of failed renames.
            </p>
          </section>

          <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
            <SectionTitle n="8">Limitations and future work</SectionTitle>
            <p className="mb-3">
              Varn currently does not restore extended attributes (xattr) or ACLs beyond
              Windows security descriptors, does not support concurrent scanning,
              streaming restore, or incremental restore, and classifies NTFS junctions as
              symlinks rather than parsing full reparse tags.
            </p>
            <p>
              These are documented, deliberate scoping decisions; the roadmap is
              maintained in the repository&apos;s FUTURE.md.
            </p>
          </section>
        </div>

        {/* 9: availability */}
        <section className="text-[15px] leading-relaxed text-justify hyphens-auto">
          <SectionTitle n="9">Availability</SectionTitle>
          <p className="mb-2">
            Varn is free and open source under the MIT OR Apache-2.0 license. Prebuilt
            binaries are published for Linux, macOS, and Windows (x86_64 and aarch64) on
            every release. The install script auto-detects the platform and adds the
            binary to the PATH:
          </p>
          <div className="max-w-2xl">
            <Listing>{installCmd}</Listing>
          </div>
          <p>
            The complete command reference, safety model, and architecture notes are on
            the{" "}
            <Link
              href="/docs"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              documentation page
            </Link>
            . Source, issue tracker, and release archives:{" "}
            <a
              href="https://github.com/flawme/varn"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              github.com/flawme/varn
            </a>
            .
          </p>
        </section>

        {/* References */}
        <section className="mt-12 border-t border-[var(--rule)] pt-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--muted-ink)] mb-4">
            REFERENCES
          </p>
          <ol className="text-[13px] leading-relaxed text-[var(--muted-ink)] space-y-1.5 list-decimal pl-5">
            <li>
              Varn repository and releases.{" "}
              <a
                href="https://github.com/flawme/varn"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                https://github.com/flawme/varn
              </a>
            </li>
            <li>
              Install script.{" "}
              <a
                href="https://raw.githubusercontent.com/flawme/varn/main/install.sh"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                https://raw.githubusercontent.com/flawme/varn/main/install.sh
              </a>
            </li>
            <li>
              Safety model — guarantees and the restore pipeline.{" "}
              <a
                href="https://github.com/flawme/varn/blob/main/docs/safety.md"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                github.com/flawme/varn/blob/main/docs/safety.md
              </a>
            </li>
            <li>
              Architecture — internals and design decisions.{" "}
              <a
                href="https://github.com/flawme/varn/blob/main/docs/architecture.md"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                github.com/flawme/varn/blob/main/docs/architecture.md
              </a>
            </li>
            <li>
              CLI usage reference.{" "}
              <a
                href="https://github.com/flawme/varn/blob/main/docs/usage.md"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                github.com/flawme/varn/blob/main/docs/usage.md
              </a>
            </li>
            <li>
              Changelog — version history.{" "}
              <a
                href="https://github.com/flawme/varn/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                github.com/flawme/varn/blob/main/CHANGELOG.md
              </a>
            </li>
          </ol>
        </section>
      </main>

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
