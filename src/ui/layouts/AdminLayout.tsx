import { MainLayoutProps } from "@/ui/layouts/MainLayout";
import ConstrainedLayout from "@/ui/layouts/ConstrainedLayout";

export default function AdminLayout(props: MainLayoutProps) {
    const { children, subheaderText, lastCrumbText, noCrumbs } = props;
    return (
        <div className="flex flex-col grow">
            <div className="flex justify-center items-center w-full p-2 bg-background text-sz-subheading lg:text-sz-subheading-lg text-contrasted font-semibold">
                <h1>Administration</h1>
            </div>
            <ConstrainedLayout
                subheaderText={subheaderText}
                lastCrumbText={lastCrumbText}
                noCrumbs={noCrumbs}
            >
                {children}
            </ConstrainedLayout>
        </div>
    );
}
