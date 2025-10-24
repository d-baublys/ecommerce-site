import Link from "next/link";
import {
    IoBagOutline,
    IoCog,
    IoHeartOutline,
    IoMenu,
    IoPersonOutline,
    IoSearchOutline,
} from "react-icons/io5";

interface ConditionalNavIcon {
    renderIcon: (isForMenu: boolean) => React.JSX.Element;
    isVisible: (isAdmin: boolean) => boolean;
}

interface RenderFixedIconsParams {
    handleSearchClick: () => void;
    handleMenuClick: () => void;
}

interface RenderConditionalIconsParams {
    isForMenu: boolean;
    isAdmin: boolean;
    hasMounted: boolean;
    itemCount: number;
    handleMenuClose: () => void;
    handleAccountClick: () => void;
}

const commonNavClasses = "relative p-2 rounded-circle items-center";
const hoverAnimation = "hover:scale-125 transition";
const displayClasses = "hidden sm:flex";
const fixedNavClasses = `${commonNavClasses} ${hoverAnimation} cursor-pointer`;
const conditionalNavClasses = `${commonNavClasses} ${hoverAnimation} ${displayClasses}`;
const menuIconClasses = "flex items-center gap-4 p-1 rounded-full";
const getConditionalSwitchedClasses = (isForMenu: boolean) =>
    isForMenu ? menuIconClasses : conditionalNavClasses;

export function renderFixedIcons(params: RenderFixedIconsParams): React.JSX.Element[] {
    const { handleSearchClick, handleMenuClick } = params;

    const navIcons = [
        <button
            key="search"
            title="Search"
            aria-label="Search"
            className={fixedNavClasses}
            onClick={handleSearchClick}
        >
            <IoSearchOutline />
        </button>,
        <button
            key="menu"
            title="Menu"
            aria-label="Menu"
            className={`block sm:hidden ${fixedNavClasses}`}
            onClick={handleMenuClick}
        >
            <IoMenu />
        </button>,
    ];

    return navIcons;
}

export function renderConditionalIcons(params: RenderConditionalIconsParams): React.JSX.Element[] {
    const { isForMenu, isAdmin, hasMounted, itemCount, handleMenuClose, handleAccountClick } =
        params;

    const navIcons: ConditionalNavIcon[] = [
        {
            renderIcon: (isForMenu) => (
                <Link
                    key={`wishlist-${isForMenu}`}
                    title="Wishlist"
                    aria-label="Wishlist"
                    href={"/wishlist"}
                    className={getConditionalSwitchedClasses(isForMenu)}
                    onClick={handleMenuClose}
                >
                    <IoHeartOutline />
                    {isForMenu && <span>Wishlist</span>}
                </Link>
            ),
            isVisible: () => true,
        },
        {
            renderIcon: (isForMenu) => (
                <Link
                    key={`bag-${isForMenu}`}
                    title="Bag"
                    aria-label="Bag"
                    href={"/bag"}
                    className={`${
                        isForMenu ? menuIconClasses : `${displayClasses} ${commonNavClasses}`
                    }`}
                    onClick={handleMenuClose}
                >
                    <div className="relative">
                        <IoBagOutline className={`${isForMenu ? "" : hoverAnimation}`} />
                        {hasMounted && itemCount > 0 && (
                            <div
                                aria-label="Bag item count"
                                className="bag-count-badge absolute flex justify-center items-center top-[-13px] right-[-10px] w-4 aspect-square rounded-circle bg-red-500 text-contrasted text-[0.67rem]"
                            >
                                <span>{Math.min(itemCount, 99)}</span>
                            </div>
                        )}
                    </div>
                    {isForMenu && <span>Bag</span>}
                </Link>
            ),
            isVisible: () => true,
        },
        {
            renderIcon: (isForMenu) => (
                <button
                    key={`account-${isForMenu}`}
                    title="Account"
                    aria-label="Account"
                    className={`${getConditionalSwitchedClasses(isForMenu)} cursor-pointer`}
                    onClick={handleAccountClick}
                >
                    <IoPersonOutline />
                    {isForMenu && <span>Account</span>}
                </button>
            ),
            isVisible: () => true,
        },
        {
            renderIcon: (isForMenu) => (
                <Link
                    key={`admin-${isForMenu}`}
                    title="Admin"
                    aria-label="Admin"
                    href={"/admin"}
                    className={getConditionalSwitchedClasses(isForMenu)}
                    onClick={handleMenuClose}
                >
                    <IoCog />
                    {isForMenu && <span>Admin</span>}
                </Link>
            ),
            isVisible: (isAdmin) => isAdmin,
        },
    ];

    const renderIcons = (isForMenu: boolean) =>
        navIcons.flatMap((item) => (item.isVisible(isAdmin) ? [item.renderIcon(isForMenu)] : []));

    return renderIcons(isForMenu);
}
