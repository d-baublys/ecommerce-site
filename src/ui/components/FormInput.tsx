export default function FormInput({
    type = "text",
    legend,
    onChange,
    value,
}: {
    type?: string;
    legend: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | number;
}) {
    return (
        <fieldset>
            <legend className="mb-2">{legend}</legend>
            <input
                type={type}
                min={0}
                step={"0.01"}
                className="w-full p-1 border-2 rounded-lg"
                onChange={onChange}
                value={value}
            ></input>
        </fieldset>
    );
}
