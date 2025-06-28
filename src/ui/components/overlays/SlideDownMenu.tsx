import CloseButton from "@/ui/components/buttons/CloseButton";

export interface MenuProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    predicate: boolean;
    predicateSetter: React.Dispatch<React.SetStateAction<boolean>>;
    overrideClasses?: string;
}

export default function SlideDownMenu({
    children,
    predicate,
    predicateSetter,
    overrideClasses,
    ...props
}: MenuProps) {
    return (
        <div
            className={`fixed left-0 w-screen h-full bg-white [transition:all_0.3s_ease-in-out] overflow-auto z-50 ${
                overrideClasses ?? ""
            } ${predicate ? "top-0" : "top-[-250%]"}`}
            {...props}
        >
            {predicate && (
                <>
                    <div className="relative inset-0 mx-4 my-(--nav-height)">
                        <div className="flex justify-center pt-[5rem] h-min">{children}</div>
                    </div>
                    <div className="fixed top-20 right-4 p-1 bg-background-lightest rounded-full z-[100]">
                        <CloseButton onClick={() => predicateSetter(false)} />
                    </div>
                </>
            )}
        </div>
    );
}
