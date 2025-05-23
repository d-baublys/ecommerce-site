export default function SubHeader({ subheaderText }: { subheaderText: string }) {
    return (
        <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
            {subheaderText}
        </div>
    );
}
