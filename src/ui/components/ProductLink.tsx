import Link from "next/link";

export default function ProductLink({
    children,
    slug,
}: {
    children: React.ReactNode;
    slug: string;
}) {
    return <Link href={`/products/${slug}`}>{children}</Link>;
}
