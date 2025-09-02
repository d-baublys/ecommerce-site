import ConfirmModal from "@/ui/components/overlays/ConfirmModal";

export default function DeleteConfirmModal() {
    return (
        <ConfirmModal
            promptText={
                <>
                    Are you sure you want to delete this product?
                    <br />
                    <br />
                    This cannot be undone.
                </>
            }
        />
    );
}
