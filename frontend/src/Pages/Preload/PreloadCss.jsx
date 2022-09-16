import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  width: 100%;

  justify-content: center;
  align-items: center;
`;

export const Img = styled.img`
  display: flex;
  height: 150px;
  position: absolute;
`;

export const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 99;
  :after {
    display: flex;
    content: "";
    width: 130px;
    height: 130px;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    border: 6px solid #f2f2f2;
    border-top: 6px dotted #f2f2f2;
    border-bottom: 6px dotted #f2f2f2;
    border-radius: 50%;
    animation: loading 2s infinite;
  }
  :before {
    font-family: "Lobster", cursive;
    font-size: 20px;
    letter-spacing: 1px;
    color: white;
    content: "";
    position: absolute;
    top: 70%;
    text-align: center;
    right: 0;
    left: 0;
    margin: auto;
  }

  @keyframes loading {
    0% {
      transform: rotate(0);
    }
    50% {
      transform: rotate(360deg);
    }
  }
`;
