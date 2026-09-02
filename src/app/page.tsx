import Link from "next/link";
import { Listing } from "@/components/listing";

const installCmd =
  "curl -fsSL https://raw.githubusercontent.com/flawme/varn/main/install.sh | sh";

const quickStart = `varn init
varn checkpoint "before changes"
# ... make changes ...
varn diff <checkpoint-id>
varn restore <checkpoint-id>`;

const highlights: Array<[string, string]> = [
  [
    "Safety checkpoint before every restore",
    "Restore captures the current state first, so even a bad restore can be undone with one command.",
  ],
  [
    "Conflict detection with explicit confirmation",
    "Files modified or added since the checkpoint are flagged. Varn never silently overwrites or deletes.",
  ],
  [
    "Hash-verified, all-or-nothing execution",
    "Every object is re-verified against its SHA-256 before touching the disk, and a pre-flight check confirms all objects exist before anything is modified.",
  ],
  [
    "Concurrency hardening (new in v0.3.0)",
    "Two real race conditions found by the regression suite — predictable temp-file names in the object store and cache saves — are fixed with unique per-write names.",
  ],
];

const evalRows: Array<[string, string, string]> = [
  ["Test suite", "442 tests, all platforms", "Full suite runs on every commit"],
  ["Regression tree", "114+ named tests", "One named test per field-reported bug, organized by OS"],
  ["Platforms in CI", "3 runners", "ubuntu-latest, windows-latest, macos-latest on every commit"],
  ["Field-tested", "Windows 11 / NTFS", "ACL, attribute, junction, and long-path regressions fixed in 0.2.x–0.3.0"],
  ["Network calls", "0", "No telemetry, no accounts, no cloud"],
];

const pipeline = [
  ["1. Plan", "Compare the target snapshot with the current filesystem; enumerate every action and conflict."],
  ["2. Confirm", "Conflicts require explicit confirmation — or the --yes flag."],
  ["3. Execute", "Capture a safety checkpoint, then restore contents, links, and metadata."],
  ["4. Verify", "Re-scan and confirm the filesystem matches the snapshot — content, kind, targets, permissions, mtimes."],
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
          <span>varn.flawme.sbs — release v0.3.0</span>
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
            <a
              href="https://github.com/flawme/varn/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--ink)] transition-colors"
            >
              Changelog
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pb-16">
        {/* Hero */}
        <section className="text-center pt-16 pb-12 border-b border-[var(--rule)]">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent)] mb-5">
            RELEASE — V0.3.0 · SEPTEMBER 2026
          </p>
          <h1 className="text-3xl md:text-[2.6rem] leading-tight font-bold tracking-tight max-w-4xl mx-auto">
            Varn: Local Filesystem Checkpointing and Safe Rollback for AI Agents and
            Automated Tools
          </h1>
          <p className="mt-6 text-[15px] text-[var(--muted-ink)] max-w-2xl mx-auto leading-relaxed">
            Capture a known state, see exactly what changed, restore it safely — entirely
            offline, coexisting with Git, with machine-readable output for agents.
          </p>
          <div className="mt-8 max-w-2xl mx-auto text-left">
            <Listing>{installCmd}</Listing>
          </div>
          <p className="mt-4 text-[13px] text-[var(--muted-ink)]">
            Linux · macOS · Windows — x86_64 and aarch64 · MIT OR Apache-2.0 ·{" "}
            <Link
              href="/docs"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              read the docs
            </Link>
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted-ink)]">
            The install script covers Linux and macOS. On Windows, grab the binary from
            the{" "}
            <a
              href="https://github.com/flawme/varn/releases"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              releases page
            </a>{" "}
            or use <code className="font-mono text-[12px]">cargo install</code> — see{" "}
            <Link
              href="/docs#installation"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              installation
            </Link>
            .
          </p>
        </section>

        {/* What's new */}
        <section className="pt-10">
          <SectionTitle n="1">Highlights</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map(([title, desc]) => (
              <div key={title} className="p-5 rounded border border-[var(--rule)] bg-[var(--box)]">
                <h3 className="font-semibold mb-2 text-[15px]">{title}</h3>
                <p className="text-sm text-[var(--muted-ink)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="pt-6">
          <SectionTitle n="2">How a rollback works</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipeline.map(([title, desc]) => (
              <div key={title} className="p-5 rounded border border-[var(--rule)]">
                <h3 className="font-semibold text-[var(--accent)] mb-2 text-[15px]">{title}</h3>
                <p className="text-sm text-[var(--muted-ink)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-3xl">
            <Listing caption="Listing 1 — A working session: checkpoint, observe, roll back.">
              {quickStart}
            </Listing>
          </div>
        </section>

        {/* Evaluation */}
        <section className="pt-6">
          <SectionTitle n="3">Evaluation</SectionTitle>
          <p className="text-[15px] leading-relaxed mb-5 max-w-3xl">
            Varn&apos;s numbers are engineering facts, not model scores: the size of the
            test suite, the breadth of the regression tree, and the guarantees the restore
            engine makes. All figures below are from the v0.3.0 repository.
          </p>
          <div className="max-w-4xl border border-[var(--rule)] rounded overflow-hidden">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-[var(--box)] border-b border-[var(--rule)]">
                  <th className="px-4 py-2.5 text-left font-semibold w-44">Metric</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Value</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {evalRows.map(([metric, value, notes], i) => (
                  <tr key={metric} className={i % 2 === 1 ? "bg-[var(--box)]" : ""}>
                    <td className="px-4 py-2.5 font-medium align-top">{metric}</td>
                    <td className="px-4 py-2.5 align-top">{value}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-ink)] align-top">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security */}
        <section className="pt-6">
          <SectionTitle n="4">Security hardening</SectionTitle>
          <p className="text-[15px] leading-relaxed mb-4 max-w-3xl">
            The restore engine assumes an adversarial filesystem. Defenses, each tied to a
            named vulnerability class:
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            <div className="p-5 rounded border border-[var(--rule)]">
              <h3 className="font-semibold mb-1.5 text-[15px]">Symlink escape</h3>
              <p className="text-sm text-[var(--muted-ink)] leading-relaxed">
                Every ancestor directory is checked before any write, so a planted symlink
                cannot redirect it outside the managed root (CVE-2026-71556 class).
              </p>
            </div>
            <div className="p-5 rounded border border-[var(--rule)]">
              <h3 className="font-semibold mb-1.5 text-[15px]">Hard-link aliasing</h3>
              <p className="text-sm text-[var(--muted-ink)] leading-relaxed">
                Hard-link targets are verified not to be symlinks, preventing inode
                aliasing of external files (CVE-2026-32232 class).
              </p>
            </div>
            <div className="p-5 rounded border border-[var(--rule)]">
              <h3 className="font-semibold mb-1.5 text-[15px]">Object tampering</h3>
              <p className="text-sm text-[var(--muted-ink)] leading-relaxed">
                Content is re-hashed after leaving the store and before touching the disk —
                corrupted objects are caught before they overwrite user data.
              </p>
            </div>
            <div className="p-5 rounded border border-[var(--rule)]">
              <h3 className="font-semibold mb-1.5 text-[15px]">Partial restores</h3>
              <p className="text-sm text-[var(--muted-ink)] leading-relaxed">
                A pre-flight check confirms every referenced object exists before anything
                is modified — a restore can fail, but it cannot fail halfway.
              </p>
            </div>
          </div>
        </section>

        {/* Availability */}
        <section className="pt-6">
          <SectionTitle n="5">Availability</SectionTitle>
          <p className="text-[15px] leading-relaxed max-w-3xl mb-2">
            Free and open source under MIT OR Apache-2.0. Prebuilt binaries for Linux,
            macOS, and Windows (x86_64, aarch64) on every release; the install script
            auto-detects the platform. Full command reference, ignore-pattern syntax, JSON
            output samples, and the safety model are on the{" "}
            <Link
              href="/docs"
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--rule)] hover:decoration-[var(--accent)]"
            >
              documentation page
            </Link>
            .
          </p>
          <p className="text-[15px] leading-relaxed max-w-3xl">
            Source and release archives:{" "}
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
              Changelog — v0.3.0 release notes.{" "}
              <a
                href="https://github.com/flawme/varn/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                github.com/flawme/varn/blob/main/CHANGELOG.md
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
              Install script.{" "}
              <a
                href="https://raw.githubusercontent.com/flawme/varn/main/install.sh"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--ink)]"
              >
                raw.githubusercontent.com/flawme/varn/main/install.sh
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
