export const isCI = () => process.env.NODE_ENV === "ci";
export const isDevelopment = () => process.env.NODE_ENV === "dev";
export const isProduction = () => process.env.NODE_ENV === "prod";
export const isTest = () => process.env.NODE_ENV === "test";
