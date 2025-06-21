import AdminLayout from "@/ui/layouts/AdminLayout";
import ProductAddEditForm from "@/ui/components/forms/ProductAddEditForm";

export default function AddProductPage() {
    return (
        <AdminLayout subheaderText="Add Product">
            <ProductAddEditForm />
        </AdminLayout>
    );
}
