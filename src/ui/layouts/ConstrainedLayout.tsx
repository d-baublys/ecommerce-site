import { MainLayoutProps } from "./MainLayout";
import MainWrapperWithSubheader from "./MainWrapperWithSubheader";

export default function ConstrainedLayout(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;

    return (
        <MainWrapperWithSubheader
            subheaderText={subheaderText}
            lastCrumbText={lastCrumbText}
            noCrumbs={noCrumbs}
        >
            <div className="flex justify-center grow">
                <div className="flex flex-col w-full justify-center items-center max-w-[1000px] min-w-[300px] sm:min-w-[500px]">
                    {children}
                </div>
            </div>
        </MainWrapperWithSubheader>
    );
}
