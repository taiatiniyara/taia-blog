import Database from "better-sqlite3"
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

const DB_PATH = process.env.DATABASE_URL ?? "data.db"

function uploadBackup() {
  if (
    !process.env.R2_ENDPOINT ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_BUCKET_NAME
  ) {
    console.log("[backup] R2 not configured, skipping")
    return
  }

  const db = new Database(DB_PATH)
  db.pragma("wal_checkpoint(TRUNCATE)")

  const backup = db.serialize()
  db.close()

  const client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  })

  const date = new Date().toISOString().slice(0, 10)
  const key = `backups/data-${date}.db`

  const upload = new Upload({
    client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(backup),
      ContentType: "application/octet-stream",
    },
  })

  upload
    .done()
    .then(() => {
      console.log(`[backup] Uploaded ${key}`)
    })
    .catch((err: unknown) => {
      console.error("[backup] Upload failed:", err)
      process.exit(1)
    })
}

uploadBackup()
