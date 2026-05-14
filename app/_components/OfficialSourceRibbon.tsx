import { SITE_DOMAIN } from "@/lib/site";
import { Icon } from "@/app/_components/Icon";

export function OfficialSourceRibbon() {
  return (
    <div className="sticky top-0 z-50 w-full bg-surface border-b border-accent/30 text-xs md:text-sm text-muted">
      <div className="flex items-center justify-center py-2 px-4 text-center">
        <Icon name="lock" className="text-accent w-4 h-4 inline-block mr-2 shrink-0 align-text-bottom" />
        Official source:{" "}
        <span className="text-accent font-medium mx-1">{SITE_DOMAIN}</span>
        {" "}— verify the SHA-256 on every download.
      </div>
    </div>
  );
}
