import MainWrapper from "./MainWrapper";

export default function BareLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainWrapper overrideClasses="!h-auto">
            <div className="flex flex-col justify-center items-center grow text-center gap-8">
                {children}
            </div>
        </MainWrapper>
    );
}
