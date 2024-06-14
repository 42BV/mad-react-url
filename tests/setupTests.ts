beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '' }
  });
});
