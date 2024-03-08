export function match(query: string, ...fields: string[]): boolean {
	return fields.some((value) => {
		const q = query.toLowerCase();
		const vws = value.replace(/\s/g, '');
		const qws = q.replace(/\s/g, '');
		const vFrags = value.split(/\s/);
		const qFrags = q.split(/\s/);

		return (
			value.includes(q) ||
			q.includes(value) ||
			vws.includes(qws) ||
			qws.includes(vws) ||
			qFrags.every((f) => vFrags.some((fragment) => fragment.includes(f) || f.includes(fragment)))
		);
	});
}

