const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
   const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
   } = request.payload;

   const id = nanoid();
   const insertedAt = new Date().toISOString();
   const updatedAt = insertedAt;
   let finished = false;

   if (!name) {
      const response = h.response({
         status: "fail",
         message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
   }

   if (pageCount === readPage) {
      finished = true;
   } else if (readPage > pageCount) {
      const response = h.response({
         status: "fail",
         message:
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
   } else {
      finished = false;
   }

   const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
   };

   books.push(newBook);

   const isSuccess = books.filter((book) => book.id === id).length > 0;

   if (isSuccess) {
      const response = h.response({
         status: "success",
         message: "Buku berhasil ditambahkan",
         data: {
            bookId: id,
         },
      });
      response.code(201);
      return response;
   }

   const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
   });
   response.code(500);
   return response;
};

const getAllBooksHandler = (request, h) => {
   const filters = request.query;

   const filteredBook = {
      status: "success",
      data: {
         books: books
            .filter((book) => {
               let valid = true;
               for (key in filters) {
                  const filtered = book[key] == filters[key];
                  valid = valid && filtered;
                  if (key == "name") {
                     const lowerBook = book[key].toLowerCase();
                     const lowerFilter = filters[key].toLowerCase();
                     const filteredName = lowerBook.includes(lowerFilter);

                     return filteredName;
                  }
               }
               return valid;
            })
            .map((item) => ({
               id: item.id,
               name: item.name,
               publisher: item.publisher,
            })),
      },
   };
   return filteredBook;
};

const getBookByIdHandler = (request, h) => {
   const { id } = request.params;

   const book = books.filter((n) => n.id === id)[0];

   if (book !== undefined) {
      return {
         status: "success",
         data: {
            book,
         },
      };
   }
   const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
   });
   response.code(404);
   return response;
};

const updateBookByIdHandler = (request, h) => {
   const { id } = request.params;
   const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
   } = request.payload;
   const updatedAt = new Date().toISOString();

   let finished = false;

   if (!name) {
      const response = h.response({
         status: "fail",
         message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
   }

   if (pageCount === readPage) {
      finished = true;
   } else if (readPage > pageCount) {
      const response = h.response({
         status: "fail",
         message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
   } else {
      finished = false;
   }

   const index = books.findIndex((book) => book.id === id);

   if (index !== -1) {
      books[index] = {
         ...books[index],
         name,
         year,
         author,
         summary,
         publisher,
         pageCount,
         readPage,
         reading,
         finished,
         updatedAt,
      };

      const response = h.response({
         status: "success",
         message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
   });
   response.code(404);
   return response;
};

const deleteBookByIdHandler = (request, h) => {
   const { id } = request.params;

   const index = books.findIndex((book) => book.id === id);

   if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
         status: "success",
         message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
   });
   response.code(404);
   return response;
};

module.exports = {
   addBookHandler,
   getAllBooksHandler,
   getBookByIdHandler,
   updateBookByIdHandler,
   deleteBookByIdHandler,
};
