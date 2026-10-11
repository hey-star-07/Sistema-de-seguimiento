// Estado compartido mínimo de la app
export const state = {
  user: null,
  programs: [],
  programById(id) { return this.programs.find(p => p.id === id); },
};
