import { mkdir, unlink } from "fs/promises";

export async function generatePDF(
	latex: string,
	id: string
): Promise<Uint8Array> {
	const tempDir = "./temp";
	const texPath = `${tempDir}/${id}.tex`;
	const pdfPath = `${tempDir}/${id}.pdf`;

	try {
		await mkdir(tempDir, { recursive: true });
		await Bun.write(texPath, latex);

		const proc = Bun.spawn(["tectonic", texPath], {
			cwd: process.cwd(),
		});

		await proc.exited;

		if (proc.exitCode !== 0) {
			const stderrText = await new Response(proc.stderr).text();
			throw new Error(`Failed to compile LaTeX: ${stderrText}`);
		}

		const pdfBuffer = await Bun.file(pdfPath).arrayBuffer();
		return new Uint8Array(pdfBuffer);
	} finally {
		try {
			await unlink(texPath);
			await unlink(pdfPath);
		} catch (cleanupError) {
			console.warn("Failed to cleanup temp files:", cleanupError);
		}
	}
}
