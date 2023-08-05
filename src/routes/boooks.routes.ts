import { PrismaClient } from '@prisma/client'; 
import { Router } from 'express';

const prisma = new PrismaClient();
const booksRoutes = Router();


booksRoutes.post('/', async (req, res) => {
    const { name, author, publishing } = req.body;
   
    const bookAlreadyExists = await prisma.books.findUnique({
      where: {
        name: name
      }
    })

    if(bookAlreadyExists){
      return res.status(400).json({message: `Book: ${name}, already exists`})
    }

    const newBook = await prisma.books.create({
        data: { name, author, publishing },
    });

    return res.status(200).json(newBook)
  
  });
  
booksRoutes.get('/', async (req, res) => {
    try {
      const books = await prisma.books.findMany();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar os livros.' });
    }
  });
  
booksRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const book = await prisma.books.findUnique({
        where: { id },
      });
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Livro não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar o livro.' });
    }
  });
  
booksRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, author, publishing } = req.body;
    try {
      const updatedBook = await prisma.books.update({
        where: { id },
        data: { name, author, publishing },
      });
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar o livro.' });
    }
  });
  
booksRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.books.delete({
        where: { id },
      });
      res.json({ message: 'Livro excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir o livro.' });
    }
  });
    

export default booksRoutes;
