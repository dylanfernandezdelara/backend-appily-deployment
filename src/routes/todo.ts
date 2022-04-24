import { Request, Response, Router } from "express";
import { CallbackError, NativeError } from "mongoose";
import { Todo } from "../models";
import { ITodo } from "../types";

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const todo = req.body;
  const newTodo = new Todo(todo);
  newTodo.save((err: CallbackError, savedTodo: ITodo) => {
    if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedTodo);
  });
});

router.patch('/:todoID', (req: Request, res: Response) => {
  const patchTodo = req.body;
  const filter = { _id: req.params.todoID };
  const opts = { new: true, runValidators: true }
  Todo.findOneAndUpdate(filter, patchTodo, opts, (err: CallbackError, savedTodo: ITodo) => {
    if (!savedTodo) return res.status(404).send("Todo param not found.");
    else if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedTodo);
  });
});

router.delete('/:todoID', (req: Request, res: Response) => {
  Todo.findByIdAndDelete({ _id: req.params.todoID }, (err: CallbackError, deletedTodo: ITodo) => {
    if (!deletedTodo) return res.status(404).send("Todo not found.");
    else if (err) return res.status(500).send("A database error occurred.");
    return res.status(200).send("Todo deleted.");
  });
});

export default router;
