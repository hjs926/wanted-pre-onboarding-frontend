import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//-------------- CSS 시작 -------------------
const Button = styled.button`
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 15px;
  border: 2px solid grey;
  width: auto;
  height: 25px;
  font-size: 15px;
  font-weight: 700;
  color: black;
  background-color: #ebddcc;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.add ? "#a9b9ff" : "none")};
  }
`;

const Input = styled.input`
  margin-top: 10px;
  margin-right: 2px;
  border-radius: 15px;
  border: 2px solid grey;
  width: auto;
  height: 25px;
  font-size: 15px;
  font-weight: 700;
  color: black;

  background-color: #ebddcc;
`;

const TodoList = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  border-radius: 15px;
  border: 2px solid grey;
  width: 50%;
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  color: black;
  background-color: #ebddcc;
`;

const CheckButton = styled.div`
  margin-bottom: auto;
  text-align: right;
`;

//-------------- CSS 끝 -------------------

const Todo = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  const getTodos = async () => {
    try {
      const access_token = localStorage.getItem("jwt");
      await axios
        .get("https://www.pre-onboarding-selection-task.shop/todos", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((result) => setTodos(result.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const createTodo = async (newTodo) => {
    try {
      const access_token = localStorage.getItem("jwt");
      await axios
        .post(
          "https://www.pre-onboarding-selection-task.shop/todos",
          {
            todo: newTodo,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          if (result.status === 201) {
            setTodos([...todos, result.data]);
            setNewTodo("");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodoClick = async (e) => {
    e.preventDefault();
    const isTodoValid = newTodo.trim().length > 0;
    if (isTodoValid) {
      createTodo(newTodo);
    }
  };

  const deleteTodo = (id) => {
    const access_token = localStorage.getItem("jwt");
    axios
      .delete(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((result) => {
        if (result.status === 204) {
          getTodos();
        }
      });
  };

  const updateTodo = async (id, text) => {
    try {
      const access_token = localStorage.getItem("jwt");
      await axios
        .put(
          `https://www.pre-onboarding-selection-task.shop/todos/${id}`,
          {
            todo: text,
            isCompleted: false,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          if (result.status === 200) {
            setTodos((prevTodos) =>
              prevTodos.map((todo) => {
                if (todo.id === id) {
                  todo.todo = text;
                }
                return todo;
              })
            );
            setEditingTodoId(null);
            setEditingTodoText("");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodoChange = (e) => {
    setEditingTodoText(e.target.value);
  };

  const handleEditTodoSubmit = async (e) => {
    e.preventDefault();
    const isTodoValid = editingTodoText.trim().length > 0;
    if (isTodoValid) {
      updateTodo(editingTodoId, editingTodoText);
    }
  };

  const handleEditTodoCancel = () => {
    setEditingTodoId(null);
    setEditingTodoText("");
  };

  function logout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <div className="Todo">
      <div>
        <h1>TODO</h1>
        <h3>오늘의 할일</h3>
      </div>
      <div>
        <Input
          data-testid="new-todo-input"
          value={newTodo}
          onChange={handleNewTodoChange}
        />
        <Button data-testid="new-todo-add-button" onClick={handleAddTodoClick}>
          추가
        </Button>
      </div>
      <div>
        {todos.map((todo) => (
          <TodoList>
            <li key={todo.id}>
              {editingTodoId === todo.id ? (
                <form onSubmit={handleEditTodoSubmit}>
                  <Input
                    type="text"
                    data-testid="modify-input"
                    value={editingTodoText}
                    onChange={handleEditTodoChange}
                  />
                  <Button type="submit" data-testid="submit-button">
                    수정
                  </Button>
                  <Button
                    type="button"
                    data-testid="cancel-button"
                    onClick={handleEditTodoCancel}
                  >
                    취소
                  </Button>
                </form>
              ) : (
                <>
                  <label>
                    <input type="checkbox" defaultChecked={todo.isCompleted} />{" "}
                    <span>{todo.todo}</span>{" "}
                  </label>
                  <CheckButton>
                    <Button
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setEditingTodoText(todo.todo);
                      }}
                    >
                      수정
                    </Button>

                    <Button onClick={() => deleteTodo(todo.id)}>삭제</Button>
                  </CheckButton>
                </>
              )}
            </li>
          </TodoList>
        ))}
      </div>
      <Button text={"로그아웃"} type={"negative"} onClick={logout}>
        로그아웃
      </Button>{" "}
    </div>
  );
};

export default Todo;
