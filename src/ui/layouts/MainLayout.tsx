import MainWrapperWithSubheader from "./MainWrapperWithSubheader";

export default function MainLayout({
    children,
    subheaderText,
    lastCrumbText,
}: {
    children: React.ReactNode;
    subheaderText?: string;
    lastCrumbText?: string;
}) {
    return (
        <MainWrapperWithSubheader subheaderText={subheaderText} lastCrumbText={lastCrumbText}>
            {children}
        </MainWrapperWithSubheader>
    );
}
