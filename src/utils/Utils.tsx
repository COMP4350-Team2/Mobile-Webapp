export function highlightText(text: string, query: string) {
	if (!query) return text;

	const parts = text.split(new RegExp(`(${query})`, "gi"));
	return parts.map((part, index) =>
		part.toLowerCase() === query.toLowerCase() ? (
			<span
				key={index}
				style={{ fontWeight: "bold" }}
			>
				{part}
			</span>
		) : (
			part
		)
	);
}
