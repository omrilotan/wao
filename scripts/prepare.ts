#!/usr/bin/env node

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { parseSet } from "../src/parseSet.ts";

const setFiles = await readdir("src/public/sets");
const list: { value: string; text: string }[] = await Promise.all(
	setFiles.map(async (file) => {
		const text = await readFile(`src/public/sets/${file}`, "utf8");
		const { metadata } = parseSet(text);
		return { value: file, text: metadata.title };
	}),
);
await mkdir("src/public/generated", { recursive: true });
await writeFile(
	"src/public/generated/sets.json",
	JSON.stringify(list, null, "\t"),
	"utf8",
);
