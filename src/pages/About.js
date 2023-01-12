import React, { Fragment } from "react";
import styled from "styled-components";
import AboutCss from "../styles/About.module.css";
const About = () => {
  const Box = styled.button`
    border: 5px solid skyblue;
    background-color: yellow;
    font-size: 50px;
    color: ${(props) => props.color || "red"};
  `;
  return (
    <>
      <section className={AboutCss.no}>
        About
        <Box>될까요?</Box>
      </section>
    </>
  );
};

export default About;
