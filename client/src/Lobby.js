import React, { useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import styled from "styled-components";
const UserItem = styled(ListGroupItem)`
  font-weight: bold;
  padding: 0.4rem;
`;

export function IndexUsers({ userss }) {
  const [show, setShow] = useState(false);
  const handleUsers = () => {
    // The pushdown is clicked or not
    if (!show) {
      setShow(true);
    }
    if (show) {
      setShow(false);
    }
  };

  //list of userids
  const userids = userss.map(user => (
    <UserItem
      key={user.user_name}
      onClick={() => {
        handleUsers();
      }}
    >
      {user.user_name}
    </UserItem>
  ));

  return (
    <div>
      <ListGroup className="list-group-vertical mb-2">{userids}</ListGroup>
    </div>
  );
}
function Lobby({ users }) {
  return (
    <div>
      <h1>Logged in</h1>
      <IndexUsers>userss={users}</IndexUsers>
    </div>
  );
}

export default Lobby;
