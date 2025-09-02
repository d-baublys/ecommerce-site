import React from "react";

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div data-testid="error-container">
                    <p>Error caught by boundary</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export function wrapWithErrorBoundary(children: React.ReactNode) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
}

export function matchSizeLabel(count: number, upperCaseSizeString: string) {
    return new RegExp(`${upperCaseSizeString}\\s*\\(${count}\\)`);
}

export function matchPriceRangeLabel(
    count: number,
    lowerBoundString: string,
    upperBoundString?: string
) {
    const pattern = upperBoundString
        ? `[£$€]${lowerBoundString}-[£$€]${upperBoundString}\\s*\\(${count}\\)`
        : `Over\\s*[£$€]${lowerBoundString}\\s*\\(${count}\\)`;

    return new RegExp(pattern);
}

export function getConsoleErrorSpy() {
    return jest.spyOn(console, "error").mockImplementation(() => {});
}
