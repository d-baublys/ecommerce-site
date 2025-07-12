import MainWrapperWithSubheader from "@/ui/layouts/MainWrapperWithSubheader";
import { MainLayoutProps } from "@/ui/layouts/MainLayout";

export default function AdminLayout(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;
    return (
        <div className="flex flex-col grow">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-sz-subheading lg:text-sz-subheading-lg text-contrasted font-semibold">
                <h1>Administration</h1>
            </div>
            <MainWrapperWithSubheader
                subheaderText={subheaderText}
                lastCrumbText={lastCrumbText}
                noCrumbs={noCrumbs}
            >
                <div className="flex justify-center grow">
                    <div className="flex flex-col w-full sm:w-1/2 justify-center items-center max-w-[900px] min-w-[300px] sm:min-w-[500px]">
                        {children}
                    </div>
                </div>
            </MainWrapperWithSubheader>
        </div>
    );
}
