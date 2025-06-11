import MainWrapper from "./MainWrapper";

export default function MainWrapperWithSubheader({
    children,
    subheaderText,
}: {
    children: React.ReactNode;
    subheaderText?: string;
}) {
    return (
        <div className="flex flex-col grow">
            <MainWrapper overrideClasses="!h-36 !max-h-36 !pb-0">
                <div className="flex h-full items-center text-sz-subheading lg:text-sz-subheading-lg font-semibold px-(--gutter-sm) sm:px-(--gutter) lg:px-(--gutter-md) ">
                    <h2>{subheaderText ?? ""}</h2>
                </div>
            </MainWrapper>
            <MainWrapper>{children}</MainWrapper>
        </div>
    );
}
