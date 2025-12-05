import app from "@/app";
import "./convert";

app.get("/", (c) => {
	return c.json(
		{
			status: 200,
			message: "Hello, World!",
		},
		200,
	);
});

export default app;
