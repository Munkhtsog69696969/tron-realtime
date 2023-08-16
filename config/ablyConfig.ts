import Ably from "ably"

export const ably = new Ably.Realtime.Promise("40g3dA.QJVKkA:fmRskRwN2wpuCFhUQdEz_zZCjCxDw_rOmK6JCdbNP9w");
ably.connection.once('connected');