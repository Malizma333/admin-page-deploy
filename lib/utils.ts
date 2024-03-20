export function match(query: string, ...fields: (string | undefined)[]): boolean {
	return fields
		.filter((value): value is string => value !== undefined)
		.map((value) => value.toLowerCase())
		.some((value) => {
			const q = query.toLowerCase();
			const vws = value.replace(/\s/g, '');
			const qws = q.replace(/\s/g, '');
			const vFrags = value.split(/\s/).filter((f) => f !== '');
			const qFrags = q.split(/\s/).filter((f) => f !== '');

			return (
				value.includes(q) ||
				q.includes(value) ||
				vws.includes(qws) ||
				qws.includes(vws) ||
				qFrags.every((f) => vFrags.some((fragment) => fragment.includes(f) || f.includes(fragment)))
			);
		});
}

