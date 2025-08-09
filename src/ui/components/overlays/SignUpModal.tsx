import SuccessModal, { BaseSuccessModalProps } from "@/ui/components/overlays/SuccessModal";

export default function SignUpModal(props: BaseSuccessModalProps) {
    return (
        <SuccessModal
            {...props}
            message="Account created successfully."
            buttonLink="/login"
            buttonText="Log In"
        />
    );
}
