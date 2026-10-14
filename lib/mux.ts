import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
  webhookSecret: process.env.MUX_WEBHOOK_SECRET!,
});

export const streamUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;
export const muxThumb = (playbackId: string) => `https://image.mux.com/${playbackId}/thumbnail.jpg`;