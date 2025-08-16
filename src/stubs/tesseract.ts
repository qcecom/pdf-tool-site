/* eslint-disable @typescript-eslint/no-unused-vars */
export async function createWorker(_lang?: string) {
  return {
    recognize: async (_canvas: any) => ({ data: { blocks: [] } }),
    terminate: async () => {}
  } as any;
}
