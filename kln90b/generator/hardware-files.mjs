// Writes the two downloadable hardware files of the External hardware page from the public events of kln90b's
// HEvents.ts: public/downloads/KLN90B-SPADneXt-Events.xml and public/downloads/myevents.txt.
// The site build reads only the two files; run this script (npm run hardware-files) whenever the pin moves.
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "..", "vendor", "kln90b", "kln90b", "HEvents.ts");
const outDir = join(root, "public", "downloads");

const text = readFileSync(source, "utf8");
const events = [...text.matchAll(/^export const EVT_\w+ = "(KLN90B_[A-Za-z0-9_]+)";/gm)]
    .map(m => m[1])
    .filter(name => !name.startsWith("KLN90B_Internal_"));
const internal = [...text.matchAll(/^export const EVT_\w+ = "(KLN90B_Internal_[A-Za-z0-9_:]*)";/gm)].map(m => m[1]);
// Every event name in the file must be written or deliberately left out, never dropped by an unforeseen declaration form.
const unaccounted = [...new Set([...text.matchAll(/"(KLN90B_[^"]*)"/g)].map(m => m[1]))]
    .filter(name => !events.includes(name) && !internal.includes(name));
if (unaccounted.length > 0) {
    throw new Error(`HEvents.ts names events this script neither writes nor leaves out as internal: ${unaccounted.join(", ")}`);
}
if (events.length === 0) {
    throw new Error(`No public events found in ${source}`);
}

const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<CustomClientEvents xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
    ...events.map(e => `  <CustomClientEvent Name="${e}" EventID="H:${e}" />`),
    "</CustomClientEvents>",
    "",
].join("\n");
const txt = events.map(e => `${e}#(>H:${e})`).join("\n") + "\n";

mkdirSync(outDir, {recursive: true});
writeFileSync(join(outDir, "KLN90B-SPADneXt-Events.xml"), xml);
writeFileSync(join(outDir, "myevents.txt"), txt);
console.log(`Wrote ${events.length} events to ${outDir}`);
