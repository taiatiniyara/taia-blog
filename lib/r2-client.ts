import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { NodeHttpHandler } from "@smithy/node-http-handler"

function isConfigured(): boolean {
  const endpoint = process.env.R2_ENDPOINT
  const accessKey = process.env.R2_ACCESS_KEY_ID
  const secretKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!endpoint || !accessKey || !secretKey || !bucket || !publicUrl) return false
  if (accessKey.startsWith("your_")) return false
  if (secretKey.startsWith("your_")) return false

  return true
}

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      requestTimeout: 20_000,
      connectionTimeout: 10_000,
    }),
  })
}

export async function uploadToR2(key: string, body: Buffer | Uint8Array | Blob, contentType: string): Promise<string> {
  if (!isConfigured()) {
    throw new Error(`R2 not configured — cannot upload ${key}`)
  }
  const client = getClient()
  const upload = new Upload({
    client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    },
  })
  await upload.done()
  return `${process.env.R2_PUBLIC_URL}/${key}`
}

export async function getFromR2(key: string): Promise<string | null> {
  if (!isConfigured()) {
    console.warn(`[r2] Not configured, skipping read: ${key}`)
    return null
  }
  try {
    const client = getClient()
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })
    const response = await client.send(command)
    if (!response.Body) return null
    const body = await response.Body.transformToString("utf-8")
    return body
  } catch (error: unknown) {
    const err = error as Error & { name?: string }
    if (err.name === "NoSuchKey") return null
    throw error
  }
}
