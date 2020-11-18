import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const EditorContainer = styled.div`
  margin: 40px;
`;

const TitleInput = styled.input`
  display: block;
`;

function Zipcode({ zip }) {
  const [myzip, setmyZip] = useState(zip ? zip.myzip : "");
  const constructZipcode = () => ({
    myzip: myzip
  });

  const url =
    "https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/y0UDK9tMgkCOtTDLhNGJstEk9PVLAIaf3wF0jtx1qey0Nke2ZfytzxiL2VxT2xhW/radius.json/" +
    zip +
    "/5/mile";
  const [zipcodes, setZipcodes] = useState(null);
  let content = null;

  useEffect(() => {
    axios.get(url).then(response => {
      setZipcodes(JSON.stringify(response.data));
    });
  }, [url]);

  if (zipcodes) {
    return (content = (
      <div>
        <h1>{zipcodes}</h1>
      </div>
    ));
  }
  return (
    <div>
      <h1>{zipcodes}</h1>
    </div>
  );
}

Zipcode.propTypes = {
  zip: PropTypes.string
};
Zipcode.defaultProps = {
  zip: null
};

export default Zipcode;
