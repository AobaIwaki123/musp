import { Select } from "@mantine/core";
import classes from "./AudioSelect.module.css";

export function AudioSelect() {
	return (
		<Select
			data={["Vocal", "Inst."]}
			defaultValue="Vocal"
			allowDeselect={false}
			className={classes.select}
		/>
	);
}
