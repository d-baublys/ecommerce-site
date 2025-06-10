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
            <MainWrapper overrideClasses="!h-36 !bg-blue-500">
                <div className="flex h-full items-center text-sz-subheading lg:text-sz-subheading-lg font-semibold md:pl-8 lg:pl-16 ">
                    <h2>{subheaderText ?? ""}</h2>
                </div>
            </MainWrapper>
            <MainWrapper>{children}</MainWrapper>
        </div>
    );
}
