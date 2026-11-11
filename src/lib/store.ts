import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { MongoClient, type Db } from "mongodb";

/*
 * Tiny storage layer.
 *
 * - With MONGODB_URI set (local Docker MongoDB or MongoDB Atlas on Vercel)
 *   everything goes to MongoDB.
 * - Without it the site still works: records go to a JSON file
 *   (.data/store.json locally, /tmp on Vercel, which is temporary).
 *
 * Documents always carry a string `_id` so both backends look the same.
 */

export type Doc = { _id: string; createdAt: string } & Record<string, unknown>;
type Filter = Record<string, unknown>;
type FindOptions = { sort?: Record<string, 1 | -1>; limit?: number; fields?: string[] };

export type Backend = "mongodb" | "json-file";

declare global {
  // eslint-disable-next-line no-var
  var __dwMongo: Promise<MongoClient> | undefined;
}

export function backend(): Backend {
  return process.env.MONGODB_URI ? "mongodb" : "json-file";
}

async function mongo(): Promise<Db> {
  if (!global.__dwMongo) {
    const client = new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 6000 });
    global.__dwMongo = client.connect().catch((err) => {
      global.__dwMongo = undefined;
      throw err;
    });
  }
  const client = await global.__dwMongo;
  return client.db(process.env.MONGODB_DB || "digital_wellness");
}

/* ---------- JSON file fallback ---------- */

const FILE = process.env.VERCEL
  ? "/tmp/dw-store.json"
  : path.join(process.cwd(), ".data", "store.json");

type FileShape = Record<string, Doc[]>;
let writeQueue: Promise<unknown> = Promise.resolve();

async function readFile(): Promise<FileShape> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as FileShape;
  } catch {
    return {};
  }
}

async function writeFile(data: FileShape) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data));
}

function matches(doc: Doc, filter: Filter) {
  return Object.entries(filter).every(([k, v]) => doc[k] === v);
}

function pick(doc: Doc, fields?: string[]) {
  if (!fields) return doc;
  const out: Record<string, unknown> = { _id: doc._id };
  for (const f of fields) out[f] = doc[f];
  return out as Doc;
}

/* ---------- public API ---------- */

export async function insertOne(collection: string, data: Record<string, unknown>): Promise<Doc> {
  const doc: Doc = { _id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  if (backend() === "mongodb") {
    const db = await mongo();
    await db.collection<Doc>(collection).insertOne(doc);
    return doc;
  }
  const job = writeQueue.then(async () => {
    const all = await readFile();
    (all[collection] ??= []).push(doc);
    await writeFile(all);
  });
  writeQueue = job.catch(() => undefined);
  await job;
  return doc;
}

export async function find(collection: string, filter: Filter = {}, opts: FindOptions = {}): Promise<Doc[]> {
  if (backend() === "mongodb") {
    const db = await mongo();
    let cursor = db.collection<Doc>(collection).find(filter as never);
    if (opts.fields) {
      cursor = cursor.project(Object.fromEntries(opts.fields.map((f) => [f, 1]))) as typeof cursor;
    }
    if (opts.sort) cursor = cursor.sort(opts.sort);
    if (opts.limit) cursor = cursor.limit(opts.limit);
    return (await cursor.toArray()) as Doc[];
  }
  let rows = ((await readFile())[collection] ?? []).filter((d) => matches(d, filter));
  if (opts.sort) {
    const [[key, dir]] = Object.entries(opts.sort);
    rows = rows.sort((a, b) => (String(a[key]) < String(b[key]) ? -dir : dir));
  }
  if (opts.limit) rows = rows.slice(0, opts.limit);
  return rows.map((d) => pick(d, opts.fields));
}

export async function findById(collection: string, id: string): Promise<Doc | null> {
  if (backend() === "mongodb") {
    const db = await mongo();
    return (await db.collection<Doc>(collection).findOne({ _id: id })) as Doc | null;
  }
  return ((await readFile())[collection] ?? []).find((d) => d._id === id) ?? null;
}

export async function updateById(collection: string, id: string, patch: Record<string, unknown>) {
  if (backend() === "mongodb") {
    const db = await mongo();
    const res = await db.collection<Doc>(collection).updateOne({ _id: id }, { $set: patch });
    return res.matchedCount > 0;
  }
  let found = false;
  const job = writeQueue.then(async () => {
    const all = await readFile();
    const row = (all[collection] ?? []).find((d) => d._id === id);
    if (row) {
      Object.assign(row, patch);
      found = true;
      await writeFile(all);
    }
  });
  writeQueue = job.catch(() => undefined);
  await job;
  return found;
}

export async function count(collection: string, filter: Filter = {}) {
  if (backend() === "mongodb") {
    const db = await mongo();
    return db.collection<Doc>(collection).countDocuments(filter as never);
  }
  return ((await readFile())[collection] ?? []).filter((d) => matches(d, filter)).length;
}
