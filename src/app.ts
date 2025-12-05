import { OpenAPIHono } from "@hono/zod-openapi";
import "dotenv/config";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";

const app = new OpenAPIHono({
	defaultHook: (result, c) => {
		if (result.success) return;

		if (
			result.error.issues.some((issue) =>
				issue.path.includes("x-api-key")
			)
		) {
			return c.json(
				{
					status: 401,
					success: false,
					message: result.error.issues[0]?.message || "Bad request",
				},
				401
			);
		}

		return c.json(
			{
				status: 400,
				success: false,
				message: result.error.issues[0]?.message || "Bad request",
			},
			400
		);
	},
});

app.use("/favicon.ico", serveStatic({ path: "./assets/favicon.ico" }));
app.use(logger());
app.use(requestId());

export default app;
