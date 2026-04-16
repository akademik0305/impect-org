import { isAxiosError, type AxiosError } from "axios";
import type { ApiResponse } from "~/types/api.types";
import API from "./API";

function isAxiosUnauthorized(err: unknown): boolean {
	return (
		typeof err === "object" &&
		err !== null &&
		"response" in err &&
		(err as AxiosError).response?.status === 401
	);
}

function fixUnauthorized() {
	const token = useToken();
	token.value = null;
	window.location.href = "/";
}

export default {
	async get(url: string, lang: string, token: string | null = null) {
		try {
			const headers: Record<string, string> = {
				"Accept-Language": lang,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			};

			const res = await API().get(url, { headers });
			return res.data;
		} catch (err: unknown) {
			if (isAxiosUnauthorized(err)) {
				fixUnauthorized();
			}
			throw err;
		}
	},

	async post<T, B>(
		url: string,
		lang: string,
		body: B,
		token: string | null = null
	): Promise<ApiResponse<T>> {
		try {
			const headers: Record<string, string> = {
				"Accept-Language": lang,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			};

			const res = await API().post<ApiResponse<T>>(url, body, { headers });
			return res.data;
		} catch (err: unknown) {
			if (isAxiosUnauthorized(err)) {
				fixUnauthorized();
			}
			// Agar bu axios error bo‘lsa, uni formatlab qaytaramiz
			if (isAxiosError(err)) {
				return {
					success: false,
					message:
						err.response?.data?.message || err.message || "Unknown error",
					data: null,
				} as ApiResponse<T>;
			}

			// Agar bu boshqa turdagi xato bo‘lsa, ham formatlab qaytaramiz
			return {
				success: false,
				message: err instanceof Error ? err.message : "Unknown error",
				data: null,
			} as ApiResponse<T>;
		}
	},
	async delete<T>(
		url: string,
		lang: string,
		token: string | null = null
	): Promise<ApiResponse<T>> {
		try {
			const headers: Record<string, string> = {
				"Accept-Language": lang,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			};

			const res = await API().delete<ApiResponse<T>>(url, { headers });
			return res.data;
		} catch (err: unknown) {
			if (isAxiosUnauthorized(err)) {
				fixUnauthorized();
			}
			throw err;
		}
	},
};

// export async function get(url, params = {}) {
//   try {
//     const response = await API.get(url, { params });
//     return response.data;
//   } catch (error) {
//     handleError(error);
//   }
// }
