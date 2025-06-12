import Breadcrumbs from "../components/Breadcrumbs";
import MainWrapper from "./MainWrapper";

export default function MainWrapperWithSubheader({
    children,
    subheaderText,
    lastCrumbText,
}: {
    children: React.ReactNode;
    subheaderText?: string;
    lastCrumbText?: string;
}) {
    return (
        <div className="flex flex-col grow">
            <MainWrapper overrideClasses="!h-36 !max-h-36 !pb-0">
                <div className="flex flex-col grow px-(--gutter-sm) sm:px-(--gutter) lg:px-(--gutter-md)">
                    <div className="flex h-1/2 items-center text-sz-subheading lg:text-sz-subheading-lg font-semibold">
                        <h2>{subheaderText ?? ""}</h2>
                    </div>
                    <Breadcrumbs lastCrumbText={lastCrumbText} />
                </div>
            </MainWrapper>
            <MainWrapper>{children}</MainWrapper>
        </div>
    );
}
