beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '' }
  });
});
