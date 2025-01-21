import { PUBLIC_POCKETBASE_LOCATION } from "$env/static/public";

export const getImageURL = (collectionId: string, recordId: string, fileName: string, size = '0x0') => {
	return `${PUBLIC_POCKETBASE_LOCATION}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};