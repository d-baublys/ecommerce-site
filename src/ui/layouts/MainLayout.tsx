import MainWrapperWithSubheader from "@/ui/layouts/MainWrapperWithSubheader";

export interface MainLayoutProps {
    children: React.ReactNode;
    subheaderText?: string;
    lastCrumbText?: string;
    noCrumbs?: boolean;
}

export default function MainLayout({
    children,
    subheaderText,
    lastCrumbText,
    noCrumbs,
}: MainLayoutProps) {
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
