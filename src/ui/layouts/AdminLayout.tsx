import { MainLayoutProps } from "@/ui/layouts/MainLayout";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";
import AdminWrapper from "./AdminWrapper";

export default function AdminLayout(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;
    return (
        <AdminWrapper>
            <ConstrainedLayout
                subheaderText={subheaderText}
                lastCrumbText={lastCrumbText}
                noCrumbs={noCrumbs}
            >
                {children}
            </ConstrainedLayout>
        </AdminWrapper>
    );
}
