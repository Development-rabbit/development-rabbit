import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const zoneName = () => process.env.BUNNY_STORAGE_ZONE_NAME;
const apiKey = () => process.env.BUNNY_STORAGE_API_KEY;
// Accepts either a bare hostname ("zone.b-cdn.net") or a full URL
// ("https://zone.b-cdn.net/") — normalized so callers can paste whichever
// format Bunny's dashboard happened to show them.
const cdnHostname = () => process.env.BUNNY_STORAGE_CDN_HOSTNAME?.replace(/^https?:\/\//, "").replace(/\/+$/, "");
const endpoint = () => process.env.BUNNY_STORAGE_ENDPOINT || "https://storage.bunnycdn.com";

const assertConfigured = () => {
  if (!zoneName() || !apiKey() || !cdnHostname()) {
    throw new Error(
      "Bunny Storage is not configured — set BUNNY_STORAGE_ZONE_NAME, BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_CDN_HOSTNAME"
    );
  }
};

// Same contract as the old uploadOnCloudinary: takes a local (multer temp)
// file path, returns { url } on success or null on failure, and always
// clears up the local temp file either way. `folder` just namespaces where
// the file lands in the storage zone (e.g. "courses", "avatars").
export const uploadOnBunnyStorage = async (localFilePath, folder = "uploads") => {
  if (!localFilePath) return null;
  try {
    assertConfigured();

    const ext = path.extname(localFilePath);
    const remotePath = `${folder}/${crypto.randomUUID()}${ext}`;
    const { size } = fs.statSync(localFilePath);

    await axios.put(`${endpoint()}/${zoneName()}/${remotePath}`, fs.createReadStream(localFilePath), {
      headers: {
        AccessKey: apiKey(),
        "Content-Type": "application/octet-stream",
        "Content-Length": size,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    fs.unlink(localFilePath, () => {});
    return { url: `https://${cdnHostname()}/${remotePath}` };
  } catch (error) {
    fs.unlink(localFilePath, () => {}); // remove the locally saved temp file as the upload operation got failed
    return null;
  }
};
