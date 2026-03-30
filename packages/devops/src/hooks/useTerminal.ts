export function useTerminal() {
  return {
    terminals: [],
    activeTerminal: null,
    loading: false,
    error: null,
    createTerminal: async () => {},
    closeTerminal: async (_id: string) => {},
    sendCommand: async (_id: string, _command: string) => {},
  };
}
