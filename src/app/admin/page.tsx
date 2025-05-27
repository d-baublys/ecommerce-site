import ListButton from "@/ui/components/ListButton";

export default function AdminPage() {
    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <span className="font-semibold text-xl">Admin Actions</span>
            <ul>
                <li>
                    <ListButton text="View and manage products" link="/products" relativeLink />
                </li>
                <li>
                    <ListButton
                        text="Manage featured products"
                        link="/manage-featured"
                        relativeLink
                    />
                </li>
            </ul>
        </div>
    );
}
