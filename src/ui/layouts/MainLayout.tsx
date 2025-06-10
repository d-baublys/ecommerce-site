import MainWrapperWithSubheader from "./MainWrapperWithSubheader";

export default function MainLayout({
    children,
    subheaderText,
}: {
    children: React.ReactNode;
    subheaderText?: string;
}) {
    return (
        <MainWrapperWithSubheader subheaderText={subheaderText}>{children}</MainWrapperWithSubheader>
    );
}
