interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    legend: string;
    ref?: React.RefObject<HTMLInputElement | null>;
}

export default function FormInput({
    type = "text",
    legend,
    ref,
    className: overrideClasses,
    ...props
}: FormInputProps) {
    return (
        <fieldset>
            <legend className="mb-2">{legend}</legend>
            <input
                type={type}
                min={0}
                step={"0.01"}
                className={`w-full p-1 border-2 bg-white rounded-lg ${overrideClasses}`}
                ref={ref}
                {...props}
            ></input>
        </fieldset>
    );
}
