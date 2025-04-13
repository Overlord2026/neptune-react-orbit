export enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

// Keep the type alias for backward compatibility
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
