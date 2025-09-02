import { IoCheckmarkCircle } from "react-icons/io5";
import Modal, { ModalProps } from "@/ui/components/overlays/Modal";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import PlainRoundedButton from "../buttons/PlainRoundedButton";

export type BaseSuccessModalProps = Omit<ModalProps, "children" | "hasCloseButton">;

export interface SuccessModalProps extends BaseSuccessModalProps {
    message: string | React.JSX.Element;
    buttonLink?: string;
    buttonText?: string;
}

export default function SuccessModal(props: SuccessModalProps) {
    return (
        <Modal
            handleClose={props.handleClose}
            isOpenState={props.isOpenState}
            hasCloseButton={true}
            overrideClasses={props.overrideClasses}
        >
            <div className="flex flex-col justify-evenly items-center grow">
                <div className="flex flex-col items-center gap-4 p-4">
                    <IoCheckmarkCircle className="shrink-0 text-go-color" size={36} />
                    <p className="text-center text-sz-interm">{props.message}</p>
                </div>
                {props.buttonLink && props.buttonText ? (
                    <PlainRoundedButtonLink
                        href={props.buttonLink}
                        overrideClasses="!bg-background-lightest"
                    >
                        {props.buttonText}
                    </PlainRoundedButtonLink>
                ) : props.buttonText ? (
                    <PlainRoundedButton>{props.buttonText}</PlainRoundedButton>
                ) : null}
            </div>
        </Modal>
    );
}
