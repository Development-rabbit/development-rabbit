import dns from "node:dns/promises";

try {
  const records = await dns.resolveSrv(
    "_mongodb._tcp.testing.ixv7q3o.mongodb.net"
  );
  console.log(records);
} catch (err) {
  console.error(err);
}