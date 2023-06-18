import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

//-------------- CSS 시작 -------------------
const Button = styled.button`
  border-radius: 15px;
  border: 2px solid grey;
  width: auto;
  height: 25px;
  font-size: 15px;
  font-weight: 700;
  color: black;
  background-color: #ebddcc;
  margin: 3px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.add ? "#a9b9ff" : "none")};
  }
`;

const Input = styled.input`
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 15px;
  border: 2px solid grey;
  width: auto;
  height: 25px;
  font-size: 15px;
  font-weight: 700;
  color: black;
  background-color: #ebddcc;
`;

const Letter = styled.div`
  font-size: 20px;
  font-weight: 800;
`;
//-------------- CSS 끝 -------------------

const Signin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      navigate("/todo", { replace: true });
    }
  }, [navigate]);

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post(
          "https://www.pre-onboarding-selection-task.shop/auth/signin",
          {
            email: state.email,
            password: state.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          if (result.status === 200) {
            const data = result.data;
            localStorage.setItem("jwt", data.access_token);
            navigate("/todo");
          }
        });
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="Signin">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <Letter>
            <div>이메일</div>
          </Letter>
          <Input
            name="email"
            value={state.email}
            data-testid="email-input"
            className="Signin_email"
            placeholder="이메일"
            type="email"
            onChange={handleChangeState}
          />
        </section>
        <section>
          <Letter>
            <div>비밀번호</div>
          </Letter>
          <Input
            name="password"
            value={state.password}
            data-testid="password-input"
            className="Signin_password"
            placeholder="비밀번호"
            type="password"
            onChange={handleChangeState}
          />
        </section>
        <Button data-testid="signin-button" type="submit">
          로그인
        </Button>
        <Button
          data-testid="signup-button"
          type="submit"
          onClick={() => navigate("/signup")}
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Signin;
