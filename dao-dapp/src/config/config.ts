import { createPublicClient, http, webSocket } from 'viem'
import { sepolia } from 'viem/chains'

const transport = process.env.NODE_ENV === 'production'
  ? http("https://ethereum-sepolia-rpc.publicnode.com")
  : webSocket("wss://ethereum-sepolia-rpc.publicnode.com")
 
export const publicClient = createPublicClient({
  chain: sepolia,
  transport,
  batch: {  
    multicall: true,
  },
})

export const webSocketClient = createPublicClient({
  chain: sepolia,
  transport: webSocket("wss://ethereum-sepolia-rpc.publicnode.com"),
  batch: {
    multicall: true,
  }
})

