import { IoCheckmarkCircle } from "react-icons/io5";
import Modal, { ModalProps } from "@/ui/components/overlays/Modal";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";

export default function BagConfirmModal({
    handleClose,
    scrollPredicate,
    hasCloseButton,
    overrideClasses,
}: Omit<ModalProps, "children">) {
    return (
        <Modal
            handleClose={handleClose}
            scrollPredicate={scrollPredicate}
            hasCloseButton={hasCloseButton}
            overrideClasses={overrideClasses}
        >
            <div className="flex flex-col justify-evenly items-center grow">
                <div className="flex flex-col items-center gap-4 p-4">
                    <IoCheckmarkCircle className="shrink-0 text-go-color" size={36} />
                    <p className="text-center text-sz-interm">Item added to bag</p>
                </div>
                <PlainRoundedButtonLink href={"/bag"}>View Bag</PlainRoundedButtonLink>
            </div>
        </Modal>
    );
}
