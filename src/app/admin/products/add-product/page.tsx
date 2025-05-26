import ProductAddEditForm from "@/ui/components/ProductAddEditForm";

export default function AddProductPage() {
    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <ProductAddEditForm />
        </div>
    );
}
