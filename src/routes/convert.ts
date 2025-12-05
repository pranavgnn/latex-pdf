import { createRoute, z } from "@hono/zod-openapi";
import app from "@/app";
import { HeaderSchema, BodySchema } from "@/schemas";
import { generatePDF } from "@/utils/pdf";

const route = createRoute({
	method: "post",
	path: "/convert",
	request: {
		headers: HeaderSchema,
		body: {
			content: {
				"application/json": {
					schema: BodySchema,
				},
			},
			required: true,
		},
	},
	responses: {
		200: {
			description: "PDF file generated successfully",
			content: {
				"application/pdf": {
					schema: z.any().openapi({
						description: "PDF file generated from LaTeX code",
					}),
				},
			},
		},
		401: {
			description: "Unauthorized: Invalid API Key",
		},
		400: {
			description: "Bad Request: Invalid LaTeX code",
		},
		500: {
			description: "Internal Server Error",
		},
	},
});

app.openapi(route, async (c) => {
	const { latex } = c.req.valid("json");

	const id = c.get("requestId");

	try {
		const pdfUint8 = await generatePDF(latex, id);

		c.header("Content-Type", "application/pdf");
		c.header("Content-Disposition", 'inline; filename="document.pdf"');
		c.header("Content-Length", String(pdfUint8.byteLength));

		return c.body(Buffer.from(pdfUint8));
	} catch (error) {
		console.error("PDF generation error:", error);
		return c.json(
			{
				status: 500,
				success: false,
				message: "Failed to generate PDF",
			},
			500
		);
	}
});
