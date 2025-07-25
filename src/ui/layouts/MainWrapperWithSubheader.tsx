import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { MainLayoutProps } from "@/ui/layouts/MainLayout";
import MainWrapper from "@/ui/layouts/MainWrapper";

export default function MainWrapperWithSubheader(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;
    return (
        <div className="flex flex-col grow">
            <MainWrapper overrideClasses="!h-36 !max-h-36 !pb-0">
                <div className="flex flex-col grow px-(--gutter-sm) sm:px-(--gutter) lg:px-(--gutter-md)">
                    <div className="flex h-1/2 items-center text-sz-subheading lg:text-sz-subheading-lg font-semibold">
                        {subheaderText && (
                            <h1 className="line-clamp-2 wrap-anywhere">{subheaderText}</h1>
                        )}
                    </div>
                    {!noCrumbs && <Breadcrumbs lastCrumbText={lastCrumbText} />}
                </div>
            </MainWrapper>
            <MainWrapper>{children}</MainWrapper>
        </div>
    );
}
