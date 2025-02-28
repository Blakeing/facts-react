/**
 * URL utility functions
 */

/**
 * Creates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string | undefined | null): string {
	if (!text) return "";
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");
}

/**
 * Creates a URL with both ID and slug for SEO-friendly URLs
 * @param id The numeric ID
 * @param name The descriptive name
 * @returns A string in the format "id-slug"
 */
export function createIdSlug(
	id: number | string,
	name: string | undefined | null,
): string {
	return `${id}-${createSlug(name)}`;
}

/**
 * Extracts the ID from an ID-slug string
 * @param idSlug A string in the format "id-slug"
 * @returns The numeric ID
 */
export function extractId(idSlug: string | undefined | null): string {
	if (!idSlug) return "";
	return idSlug.split("-")[0] || "";
}

/**
 * Creates a YouTube-style URL with ID and name as query parameters
 * @param id The numeric ID
 * @param name The descriptive name
 * @returns A string with query parameters for id and name
 */
export function createQueryParams(
	id: number | string,
	name: string | undefined | null,
): { id: string; name: string } {
	return {
		id: id.toString(),
		name: createSlug(name),
	};
}

/**
 * Extracts the name from a query parameter or URL segment
 * @param name The name query parameter or URL segment
 * @returns The formatted name for display
 */
export function formatNameForDisplay(name: string | undefined | null): string {
	if (!name) return "";
	// Replace hyphens with spaces and capitalize each word
	return name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
