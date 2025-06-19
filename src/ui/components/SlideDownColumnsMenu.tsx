import SlideDownMenu, { MenuProps } from "./SlideDownMenu";

type GridMenuProps = Omit<MenuProps, "children"> & {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
};

export default function SlideDownColumnsMenu(props: GridMenuProps) {
    return (
        <SlideDownMenu {...props}>
            <div className="flex w-3/4">
                <div className="flex flex-col pl-[5%] w-full gap-4">
                    {props.leftContent ?? null}
                </div>
                <div className="flex flex-col pl-[5%] w-full gap-4">
                    {props.rightContent ?? null}
                </div>
            </div>
        </SlideDownMenu>
    );
}
