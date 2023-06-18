import React, { useRef, useState, useEffect } from "react";
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

const Signup = () => {
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
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
    const BASE_URL = "https://www.pre-onboarding-selection-task.shop/";
    try {
      await axios
        .post(
          `${BASE_URL}auth/signup`,
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
          if (result.status === 201) {
            alert("회원가입이 완료되었습니다.");
            navigate("/signin", { replace: true });
          }
        });
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="Signup">
      <h1>회원가입</h1>
      <section>
        <Letter>
          <div>이메일</div>
        </Letter>
        <Input
          ref={emailInput}
          name="email"
          value={state.email}
          data-testid="email-input"
          className="Signup_email"
          placeholder="이메일을 입력하세요"
          onChange={handleChangeState}
        />
      </section>
      <section>
        <Letter>
          <div>비밀번호</div>
        </Letter>
        <Input
          ref={passwordInput}
          name="password"
          value={state.password}
          data-testid="password-input"
          className="Signup_password"
          placeholder="8자 이상 입력하세요"
          type="password"
          onChange={handleChangeState}
        />
      </section>
      <Button
        data-testid="signup-button"
        onClick={handleSubmit}
        disabled={!state.email.includes("@") || state.password.length < 8}
      >
        회원가입
      </Button>
    </div>
  );
};

export default Signup;
