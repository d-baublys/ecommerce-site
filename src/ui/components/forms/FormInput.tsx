"use client";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    legend: string;
    overrideClasses?: string;
    ref?: React.RefObject<HTMLInputElement | null>;
}

export default function FormInput({
    type = "text",
    legend,
    overrideClasses,
    ref,
    ...props
}: FormInputProps) {
    return (
        <fieldset>
            <legend className="mb-2 text-sz-label-button lg:text-sz-label-button-lg">
                {legend}
            </legend>
            <input
                type={type}
                min={0}
                step={"0.01"}
                className={`w-full p-1 bg-white rounded-lg ${overrideClasses ?? ""}`}
                ref={ref}
                {...props}
            ></input>
        </fieldset>
    );
}
