import { z } from "@hono/zod-openapi";

export const HeaderSchema = z
	.object({
		"x-api-key": z
			.string("Missing API key")
			.min(1, "Missing API key")
			.refine((key) => key === process.env.API_KEY, {
				message: "Invalid API key",
			})
			.openapi({
				type: "string",
				description: "API key for authentication",
				example: "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456",
			}),
	})
	.required()
	.openapi("Headers");

export const BodySchema = z
	.object({
		latex: z
			.string("LaTex code must be string")
			.min(1, "LaTeX code cannot be empty")
			.openapi({
				description: "LaTeX code to be converted to PDF",
				example:
					"\\documentclass{article}\n\\begin{document}\nHello, World!\n\\end{document}",
			}),
	})
	.openapi("LatexToPdfRequest");
