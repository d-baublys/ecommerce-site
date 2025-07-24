import AdminLayout from "@/ui/layouts/AdminLayout";
import ProductAddEditForm from "@/ui/components/forms/ProductAddEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add product | Admin",
};

export default function AddProductPage() {
    return (
        <AdminLayout subheaderText="Add Product">
            <ProductAddEditForm />
        </AdminLayout>
    );
}
