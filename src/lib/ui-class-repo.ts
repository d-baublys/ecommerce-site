export function getSkeletonSweep() {
    return "before:content-[''] before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:animate-skeleton-sweep";
}

export function getPlainButtonClasses() {
    return "bg-white border border-component-color";
}

export function getGoButtonClasses(predicate: boolean) {
    return `text-contrasted border ${
        predicate
            ? "bg-go-color border-go-color"
            : "bg-component-color border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
    }`;
}
