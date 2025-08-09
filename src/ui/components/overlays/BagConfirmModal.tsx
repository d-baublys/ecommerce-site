import SuccessModal, { BaseSuccessModalProps } from "@/ui/components/overlays/SuccessModal";

export default function BagConfirmModal(props: BaseSuccessModalProps) {
    return (
        <SuccessModal
            {...props}
            message="Item added to bag"
            buttonLink="/bag"
            buttonText="View Bag"
        />
    );
}
