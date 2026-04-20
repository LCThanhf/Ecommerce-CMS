export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Bad response')
    }
    return response.json() as Promise<T>
  },
}
