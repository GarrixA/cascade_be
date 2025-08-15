export const isValidUUID = (uuid: any) => {
	const regex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(uuid);
};
