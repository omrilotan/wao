export function parseSet(text: string): {
	metadata: Record<string, string>;
	qNa: Record<"question" | "answer", string>[];
} {
	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const headerIndex = lines.findIndex((line) => line.startsWith("---"));
	const header = lines.slice(0, headerIndex);
	const body = lines.slice(headerIndex + 1);
	const metadata: Record<string, string> = header.reduce((acc, line) => {
		const [key, value] = line.split(":").map((part) => part.trim());
		acc[key.toLowerCase()] = value;
		return acc;
	}, {});
	const qNa = body
		.map((line) => {
			const [question, answer] = line.split("|").map((part) => part.trim());
			return { question, answer };
		})
		.sort(() => Math.random() - 0.5);
	return { metadata, qNa };
}
