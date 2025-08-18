import SlideDownMenu, { MenuProps } from "@/ui/components/overlays/SlideDownMenu";

type GridMenuProps = Omit<MenuProps, "children"> & {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
};

export default function SlideDownColumnsMenu({
    leftContent,
    rightContent,
    ...rest
}: GridMenuProps) {
    return (
        <SlideDownMenu {...rest}>
            <div className="flex w-3/4 max-w-[1000px]">
                <div className="flex flex-col pl-[5%] w-full gap-4">{leftContent ?? null}</div>
                <div className="flex flex-col pl-[5%] w-full gap-4">{rightContent ?? null}</div>
            </div>
        </SlideDownMenu>
    );
}
