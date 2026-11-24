import Image from "next/image";
import { useId } from "react";
import { getImageUrl } from "@/lib/images";
import type { WatchGroup } from "@/lib/watchProviders";

type WatchProviderGroupsProps = {
  groups: WatchGroup[];
};

export function WatchProviderGroups({ groups }: WatchProviderGroupsProps) {
  const idPrefix = useId();

  return (
    <div className="mt-6 space-y-6">
      {groups.map(({ label, providers }) => (
        <div key={label}>
          <h3
            id={`${idPrefix}-${label}`}
            className="text-sm font-semibold tracking-wider text-muted uppercase"
          >
            {label}
          </h3>
          <ul
            aria-labelledby={`${idPrefix}-${label}`}
            className="mt-3 flex flex-wrap gap-x-6 gap-y-4"
          >
            {providers.map((provider) => {
              const logoUrl = getImageUrl(provider.logo_path, "w92");

              return (
                <li key={provider.provider_id} className="flex items-center gap-3">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                      className="size-11 rounded-lg"
                    />
                  ) : (
                    <div aria-hidden="true" className="size-11 rounded-lg bg-surface" />
                  )}
                  <span className="text-sm">{provider.provider_name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
