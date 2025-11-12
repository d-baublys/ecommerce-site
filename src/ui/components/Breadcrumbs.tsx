"use client";

import { capitalize } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs({ lastCrumbText }: { lastCrumbText?: string }) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    const crumbLink = (link: string, label: string, idx: number) => (
        <li key={idx} className="mr-2">
            <Link href={link}>{label}</Link>
            {idx !== pathSegments.length && <span className="ml-2">/</span>}
        </li>
    );

    const buildCrumbs = (pathSegments: string[]) => {
        const crumbs = pathSegments.map((segment, idx) => {
            if (pathSegments[idx - 1] === "products" && pathSegments[idx - 2] !== "admin") return; // omit inner UUIDs in main product pages

            const link = "/" + pathSegments.slice(0, idx + 1).join("/");
            const label =
                lastCrumbText && idx === pathSegments.length - 1
                    ? lastCrumbText
                    : capitalize(decodeURIComponent(segment).replace(/-/g, " "));

            return crumbLink(link, label, idx + 1);
        });

        return crumbs;
    };

    return (
        <nav
            id="breadcrumbs"
            className="flex w-full items-end h-1/2 text-sz-label-button lg:text-sz-label-button-lg"
        >
            {pathSegments.length > 0 && (
                <ol className="flex">
                    {crumbLink("/", "Home", 0)}
                    {buildCrumbs(pathSegments)}
                </ol>
            )}
        </nav>
    );
}
