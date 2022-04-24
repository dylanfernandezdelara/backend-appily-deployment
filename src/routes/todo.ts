import { Request, Response, Router } from "express";
import { CallbackError } from "mongoose";
import { Todo } from "../models";
import { ITodo } from "../types";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const todo = req.body;
  const newTodo = new Todo(todo);
  newTodo.save((err: CallbackError, savedTodo: ITodo) => {
    if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedTodo);
  });
});

router.patch("/:todoID", async (req: Request, res: Response) => {
  const patchTodo = req.body;
  const filter = { _id: req.params.todoID };
  const opts = { new: true, runValidators: true };
  if(req.query["toggle"]){
    try {
      const todo = await Todo.findOne(filter);
      todo.done = !todo.done;
      todo.save();
      return res.json(todo);
    } catch (error) {
      return res.status(500).send("A database error occurred.");
    }
  }
  Todo.findOneAndUpdate(filter, patchTodo, opts, (err: CallbackError, savedTodo: ITodo) => {
    if (!savedTodo) return res.status(404).send("Todo not found.");
    else if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedTodo);
  });
});

router.delete("/:todoID", (req: Request, res: Response) => {
  Todo.findByIdAndDelete({ _id: req.params.todoID }, (err: CallbackError, deletedTodo: ITodo) => {
    if (!deletedTodo) return res.status(404).send("Todo not found.");
    else if (err) return res.status(500).send("A database error occurred.");
    return res.status(200).send("Todo deleted.");
  });
});

export default router;
