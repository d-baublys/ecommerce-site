import Link from "next/link";

interface ProductLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
    slug: string;
}

export default function ProductLink({ slug, ...props }: ProductLinkProps) {
    return (
        <Link href={`/products/${encodeURIComponent(slug)}`} className="h-min z-0" {...props}>
            {props.children}
        </Link>
    );
}
