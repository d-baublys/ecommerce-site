import SubHeader from "@/ui/components/SubHeader";

export default function AdminLayout({ children }: { children: React.ReactNode}) {
    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="Administration" />
            {children}
        </div>
    );
}
