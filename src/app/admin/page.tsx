import ListButton from "@/ui/components/ListButton";

export default function AdminPage() {
    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <h2 className="font-semibold text-sz-subheading lg:text-sz-subheading-lg">
                Admin Actions
            </h2>
            <ul>
                <li>
                    <ListButton link="/products" relativeLink>
                        View and manage products
                    </ListButton>
                </li>
                <li>
                    <ListButton link="/manage-featured" relativeLink>
                        Manage featured products
                    </ListButton>
                </li>
            </ul>
        </div>
    );
}
