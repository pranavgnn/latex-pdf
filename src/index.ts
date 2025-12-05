import { Scalar } from "@scalar/hono-api-reference";
import app from "@/routes";

app.doc("/docs", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "LaTeX to PDF Conversion API",
		description: "An API to convert LaTeX code into PDF documents.",
	},
});

app.get(
	"/reference",
	Scalar({
		url: "/docs",
		theme: "default",
		pageTitle: "LaTeX to PDF API",
	})
);

export default {
	port: process.env.Port || 3000,
	fetch: app.fetch,
};
