/// <reference types="vite/client" />

declare module "*?worker" {
  const WorkerFactory: { new (): Worker };
  export default WorkerFactory;
}

interface ImportMetaEnv {
  readonly VITE_AI_ENABLED?: string;
  readonly VITE_BILLING_ENABLED?: string;
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_PRO?: string;
  readonly VITE_PRO_CODE?: string;
  readonly VITE_DEBUG?: string;
}
