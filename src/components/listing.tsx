import { CopyButton } from "@/components/copy-button";

export function Listing({ children, caption }: { children: string; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="relative group">
        <pre className="overflow-x-auto rounded border border-[var(--rule)] bg-[var(--box)] p-3.5 pr-10 text-[13px] leading-relaxed text-[var(--ink)]">
          <code>{children}</code>
        </pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={children} />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[13px] text-[var(--muted-ink)] text-center">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
