export const endpoints = {
    items: {
      list: '/items',
      rename: (id: number) => `/items/${id}`,
      createFolder: '/create-folder',
    },
    files: {
      upload: '/files/upload',
      replace: (id: number) => `/files/${id}/replace`,
      preview: (id: number) => `/files/${id}/preview`,
    },
  };