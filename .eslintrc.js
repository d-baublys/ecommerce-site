module.exports = {
    extends: ["next/core-web-vitals"],
    rules: {
        "react/jsx-no-literals": ["warn", { ignoreProps: true }],
    },
};
