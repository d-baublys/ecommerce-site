export default function AdminWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col grow">
            <div className="flex justify-center items-center w-full p-2 bg-background text-sz-subheading lg:text-sz-subheading-lg text-contrasted font-semibold">
                <h1>Administration</h1>
            </div>
            {children}
        </div>
    );
}
