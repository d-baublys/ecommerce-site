export default function SubHeader({ subheaderText }: { subheaderText: string }) {
    return (
        <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-sz-subheading lg:text-sz-subheading-lg text-contrasted font-semibold">
            {subheaderText}
        </div>
    );
}
