import BareLayout from "@/ui/layouts/BareLayout";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";

export default function NotFound() {
    return (
        <BareLayout>
            <p>{"Oops! It seems the page you're looking for doesn't exist."}</p>
            <div>
                <PlainRoundedButtonLink href={"/"}>Home</PlainRoundedButtonLink>
            </div>
        </BareLayout>
    );
}
