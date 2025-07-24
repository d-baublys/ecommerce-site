import AdminLayout from "@/ui/layouts/AdminLayout";
import ListButton from "@/ui/components/buttons/ListButton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin",
};

export default function AdminPage() {
    return (
        <AdminLayout subheaderText="Admin Actions">
            <ul className="flex flex-col gap-4">
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
        </AdminLayout>
    );
}
