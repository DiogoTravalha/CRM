import styled from "styled-components";

const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 99;
  :after {
    display: flex;
    content: "";
    width: 25px;
    height: 25px;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    border: 1px solid #f2f2f2;
    border-top: 1px dotted #f2f2f2;
    border-bottom: 1px dotted #f2f2f2;
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

export default () => {
  return <Loading />;
};
