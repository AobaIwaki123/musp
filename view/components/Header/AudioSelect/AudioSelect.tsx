import { Select } from "@mantine/core";

function AudioSelect() {
	return (
		<Select
			label="Your favorite library"
			placeholder="Pick value"
			data={["React", "Angular", "Vue", "Svelte"]}
		/>
	);
}
