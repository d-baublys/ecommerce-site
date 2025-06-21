import MainWrapper from "@/ui/layouts/MainWrapper";

export default function BareLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainWrapper overrideClasses="!h-auto">
            <div className="flex flex-col justify-center items-center grow text-center gap-8 px-4">
                {children}
            </div>
        </MainWrapper>
    );
}
