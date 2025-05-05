import {Chunk} from "../entities/world/chunk.ts";
import {type ChunkGeneratorParams, generateChunkData} from "../entities/world/chunk_2.ts";

self.onmessage = function (message: MessageEvent<ChunkGeneratorParams>) {
    // console.log({message}, "from worker")

    const {playerX, playerY, seed, tileSize, chunkSize} = message.data;

    const generatedChunks = generateChunkData({
        playerX,
        playerY,
        seed,
        tileSize,
        chunkSize
    })

    self.postMessage(generatedChunks)

}