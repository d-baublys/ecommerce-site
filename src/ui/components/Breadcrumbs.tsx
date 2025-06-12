"use client";

import { capitalize } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs({ lastCrumbText }: { lastCrumbText?: string }) {
    const pathname = usePathname();
    const segmentArr = pathname.split("/").filter(Boolean);

    const crumbLink = (link: string, label: string, idx: number) => (
        <li key={idx} className="mr-2">
            <Link href={link}>{label}</Link>
            {idx !== segmentArr.length && <span className="ml-2">/</span>}
        </li>
    );

    const buildCrumbs = (segmentArr: string[]) => {
        const crumbs = segmentArr.map((segment, idx) => {
            const link = "/" + segmentArr.slice(0, idx + 1).join("/");
            const label =
                lastCrumbText && idx === segmentArr.length - 1
                    ? lastCrumbText
                    : capitalize(decodeURIComponent(segment).replace(/-/g, " "));

            return crumbLink(link, label, idx + 1);
        });

        return crumbs;
    };

    return (
        <nav className="flex w-full items-end h-1/2 text-sz-label-button lg:text-sz-label-button-lg">
            {segmentArr.length > 0 && (
                <ol className="flex">
                    {crumbLink("/", "Home", 0)}
                    {buildCrumbs(segmentArr)}
                </ol>
            )}
        </nav>
    );
}
