import Link from "next/link";
import React from "react";

export const Header = () => {
	return (
		<header className="bg-emerald-500  shadow-lg py-4">
			<div className="container mx-auto flex items-center justify-between px-4">
				<Link href="/">
					<h1 className=" text-amber-50 text-2xl font-extrabold italic tracking-wide cursor-pointer hover:text-yellow-200 transition-colors duration-300">
						推し麺ノート
					</h1>
				</Link>
				<nav>
					<ul className="flex space-x-6">
						<li>
							<Link href="/" className="hover:text-yellow-200 transition-colors duration-300">
							</Link>
						</li>
						<li>
							<Link href="/about" className="hover:text-yellow-200 transition-colors duration-300">
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:text-yellow-200 transition-colors duration-300">
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};
