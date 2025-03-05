import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export function getMagazineUrl(path: string) {
	return `${process.env.NEXT_PUBLIC_MAGAZINE_URL}${path}`;
}
