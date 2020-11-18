import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import axios from "axios";

function Zipcode({ zip }) {
  const url =
    "https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/y0UDK9tMgkCOtTDLhNGJstEk9PVLAIaf3wF0jtx1qey0Nke2ZfytzxiL2VxT2xhW/radius.json/" +
    zip +
    "/5/mile";
  const [zipcodes, setZipcodes] = useState(null);

  useEffect(() => {
    axios.get(url).then(response => {
      setZipcodes(JSON.stringify(response.data));
    });
  }, [url]);

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
