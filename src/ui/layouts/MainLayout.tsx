import MainWrapperWithSubheader from "@/ui/layouts/MainWrapperWithSubheader";

export interface MainLayoutProps {
    children: React.ReactNode;
    subheaderText?: string;
    lastCrumbText?: string;
    noCrumbs?: boolean;
}

export default function MainLayout(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;
    return (
        <MainWrapperWithSubheader
            subheaderText={subheaderText}
            lastCrumbText={lastCrumbText}
            noCrumbs={noCrumbs}
        >
            {children}
        </MainWrapperWithSubheader>
    );
}
